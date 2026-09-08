import base64
import json
import re
from typing import Any, Optional

from app.core.config import get_model


def extract_and_parse_json(raw_text: str) -> Any:
    """Robustly extracts and parses JSON even if wrapped in markdown codeblocks."""
    text = raw_text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\s*```$", "", text)
        text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    array_match = re.search(r"\[\s*\{.*\}\s*\]", text, re.DOTALL)
    if array_match:
        try:
            return json.loads(array_match.group(0))
        except json.JSONDecodeError:
            pass

    obj_match = re.search(r"\{.*\}", text, re.DOTALL)
    if obj_match:
        try:
            return json.loads(obj_match.group(0))
        except json.JSONDecodeError:
            pass

    raise ValueError("Could not parse valid JSON from AI response")


def build_prompt(
    topic: str,
    question_count: int,
    quiz_type: str,
    source_type: str = "topic",
    content_text: Optional[str] = None,
    file_name: Optional[str] = None,
    sections: Optional[list[dict]] = None,
) -> str:
    active_sections = [s for s in (sections or []) if s.get("question_count", 0) > 0]
    is_mixed = len(active_sections) > 1 or quiz_type == "Mixed Assessment"

    total_count = sum(s.get("question_count", 0) for s in active_sections) if is_mixed and active_sections else question_count

    if source_type == "file":
        base = f"Analyze the attached source document/image ('{file_name or 'file'}') thoroughly.\n"
        base += f"Create a {total_count}-question assessment derived STRICTLY from the provided material.\n"
        if topic and topic.strip() and topic != "General Curriculum Assessment":
            base += f"Focus particularly on the topic or section: {topic.strip()}.\n"
    elif source_type == "text" and content_text:
        base = f"Analyze the following course material / lecture notes thoroughly:\n"
        base += f"--- START OF SOURCE MATERIAL ---\n{content_text.strip()}\n--- END OF SOURCE MATERIAL ---\n\n"
        base += f"Create a {total_count}-question assessment derived STRICTLY from the source material above.\n"
        if topic and topic.strip() and topic != "General Curriculum Assessment":
            base += f"Focus particularly on the topic or section: {topic.strip()}.\n"
    else:
        base = f"Create a {total_count}-question assessment about {topic}.\n"

    base += "Respond ONLY with a JSON array of objects without additional text.\n"

    if is_mixed and active_sections:
        base += "\nThe assessment must be divided into specific sections with the following exact question distribution:\n"
        for idx, sec in enumerate(active_sections):
            roman = ["I", "II", "III", "IV", "V"][min(idx, 4)]
            stype = sec.get("quiz_type", "Multiple Choice")
            scount = sec.get("question_count", 5)
            base += f"- Part {roman} ({scount} items): {stype}\n"

        base += """\nEach object in the JSON array must have:
- "question": The question text
- "quiz_type": Exactly one of ("Multiple Choice", "True or False", "Identification", "Open Ended")
- "section_name": e.g. "Part I: Multiple Choice" or "Part II: Open Ended"
- "options": For Multiple Choice: 4 options array. For True/False: ["True", "False"]. For Identification/Open Ended: [] (empty array).
- "answer": The exact correct answer string or comprehensive model answer"""
    else:
        if quiz_type == "Multiple Choice":
            base += """Each object must have:
- "question": The question text
- "quiz_type": "Multiple Choice"
- "options": An array of 4 strings
- "answer": The exact correct option string"""
        elif quiz_type == "True or False":
            base += """Each object must have:
- "question": The question text (a statement)
- "quiz_type": "True or False"
- "options": ["True", "False"]
- "answer": Either "True" or "False" """
        elif quiz_type == "Identification":
            base += """Each object must have:
- "question": The question text (should have a specific one-word or short-phrase answer)
- "quiz_type": "Identification"
- "answer": The correct answer (a single word or short phrase)
- "options": [] (empty array)"""
        elif quiz_type == "Open Ended":
            base += """Each object must have:
- "question": An open-ended question requiring explanation
- "quiz_type": "Open Ended"
- "answer": A comprehensive model answer
- "options": [] (empty array)"""

    return base


def validate_quiz_data(quiz_data: list, quiz_type: str) -> None:
    if not isinstance(quiz_data, list) or len(quiz_data) == 0:
        raise ValueError("Response is not a non-empty JSON array")

    for i, q in enumerate(quiz_data):
        if "question" not in q or "answer" not in q:
            raise ValueError(f"Question {i + 1} missing required fields")

        item_type = q.get("quiz_type", quiz_type)
        if item_type in ("Multiple Choice", "True or False"):
            if "options" not in q or not isinstance(q["options"], list) or len(q["options"]) < 2:
                raise ValueError(f"Question {i + 1} has invalid options")
            if q["answer"] not in q["options"]:
                q["options"][0] = q["answer"]


def generate_quiz(
    topic: str,
    question_count: int,
    quiz_type: str,
    source_type: str = "topic",
    content_text: Optional[str] = None,
    file_base64: Optional[str] = None,
    file_mime_type: Optional[str] = None,
    file_name: Optional[str] = None,
    sections: Optional[list[dict]] = None,
) -> list[dict]:
    model = get_model()
    prompt = build_prompt(
        topic=topic,
        question_count=question_count,
        quiz_type=quiz_type,
        source_type=source_type,
        content_text=content_text,
        file_name=file_name,
        sections=sections,
    )

    if source_type == "file" and file_base64 and file_mime_type:
        raw_bytes = base64.b64decode(file_base64)
        blob_part = {
            "mime_type": file_mime_type,
            "data": raw_bytes,
        }
        contents = [blob_part, prompt]
        response = model.generate_content(contents)
    else:
        response = model.generate_content(prompt)

    quiz_data = extract_and_parse_json(response.text)
    validate_quiz_data(quiz_data, quiz_type)

    for q in quiz_data:
        if "options" not in q or not isinstance(q["options"], list):
            q["options"] = []
        if "quiz_type" not in q:
            q["quiz_type"] = quiz_type

    return quiz_data
