from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.quiz import QuizSubmissionRequest
from app.models import Submission, User
from app.api.dependencies import get_db_session, get_current_user
from app.crud.crud_submission import create_submission, get_submissions_by_role, delete_submission
from app.crud.crud_quiz import get_quiz_by_id

router = APIRouter()

@router.post("/submit-quiz")
async def submit_quiz(
    submission_req: QuizSubmissionRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    if submission_req.total_questions <= 0:
        raise HTTPException(status_code=400, detail="total_questions must be greater than 0")

    official_quiz = await get_quiz_by_id(db, submission_req.quiz_id)
    
    calculated_score = 0.0

    if official_quiz and official_quiz.questions:
        official_questions = official_quiz.questions
        actual_total = len(official_questions)
        
        verified_answers = []
        for i, ans in enumerate(submission_req.answers):
            user_ans_text = (ans.get("user_answer") or "").strip()
            
            if i < actual_total:
                correct_ans_text = (official_questions[i].get("answer") or "").strip()
                q_text = official_questions[i].get("question", ans.get("question", ""))
            else:
                correct_ans_text = (ans.get("correct_answer") or "").strip()
                q_text = ans.get("question", "")
                
            is_corr = bool(ans.get("is_correct"))
            if official_quiz.quiz_type in ("Multiple Choice", "True or False"):
                is_corr = user_ans_text.lower() == correct_ans_text.lower()
                
            if is_corr:
                calculated_score += 1.0
                
            verified_answers.append({
                "question": q_text,
                "user_answer": user_ans_text,
                "correct_answer": correct_ans_text,
                "is_correct": is_corr,
                "ai_feedback": ans.get("ai_feedback", "Correct choice verified." if is_corr else f"Correct: {correct_ans_text}"),
            })
            
        verified_score = min(calculated_score, float(actual_total))
        total_q = actual_total
        final_answers = verified_answers
    else:
        if submission_req.answers:
            for ans in submission_req.answers:
                if ans.get("is_correct") is True:
                    calculated_score += 1.0
            verified_score = min(calculated_score, float(submission_req.total_questions))
        else:
            verified_score = min(max(0.0, float(submission_req.score)), float(submission_req.total_questions))
        total_q = submission_req.total_questions
        final_answers = submission_req.answers

    percentage = round((verified_score / max(1, total_q)) * 100, 2)

    new_sub = Submission(
        student_name=current_user.full_name,
        student_email=current_user.email,
        quiz_id=submission_req.quiz_id,
        topic=submission_req.topic,
        score=verified_score,
        total_questions=total_q,
        percentage=percentage,
        answers=final_answers
    )
    
    new_sub = await create_submission(db, new_sub)
    return {"message": "Quiz submitted successfully", "status": "ok", "submission": new_sub}


@router.get("/grades")
async def get_grades(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    submissions = await get_submissions_by_role(db, current_user.role, current_user.email)
    return {"submissions": submissions}


@router.delete("/grades/{submission_id}")
async def delete_grade_endpoint(
    submission_id: int,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    success = await delete_submission(db, submission_id)
    if not success:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    return {"message": "Submission deleted successfully", "id": submission_id}
