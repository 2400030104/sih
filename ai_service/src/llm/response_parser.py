import re
from typing import Dict, Any, List

def parse_copilot_response(raw_text: str, default_intent: str = "GENERAL_QUERY", evidence_list: List[str] = None) -> Dict[str, Any]:
    """
    Parses structured sections (ANSWER, WHY/EVIDENCE, PREDICTION, RECOMMENDED ACTION, LIMITATION)
    from Copilot synthesis.
    """
    sections = {
        "answer": "",
        "evidence": "",
        "prediction": "",
        "recommendedAction": "",
        "limitation": "PRAGATI-AI provides analytical and model-assisted decision support. Outputs are not official administrative decisions and should be reviewed by authorized personnel."
    }

    # Extract standard tagged sections if present
    patterns = {
        "answer": r"ANSWER:\s*(.*?)(?=\n(?:WHY|EVIDENCE|PREDICTION|RECOMMENDED ACTION|LIMITATION):|\Z)",
        "evidence": r"(?:WHY\s*\/\s*EVIDENCE|EVIDENCE|WHY):\s*(.*?)(?=\n(?:PREDICTION|RECOMMENDED ACTION|LIMITATION):|\Z)",
        "prediction": r"PREDICTION:\s*(.*?)(?=\n(?:RECOMMENDED ACTION|LIMITATION):|\Z)",
        "recommendedAction": r"RECOMMENDED ACTION:\s*(.*?)(?=\n(?:LIMITATION|\Z)|\Z)",
        "limitation": r"(?:LIMITATION\s*\/\s*DISCLAIMER|LIMITATION|DISCLAIMER):\s*(.*?)\Z"
    }

    found_structured = False
    for key, pattern in patterns.items():
        match = re.search(pattern, raw_text, re.DOTALL | re.IGNORECASE)
        if match:
            sections[key] = match.group(1).strip()
            found_structured = True

    if not found_structured or not sections["answer"]:
        sections["answer"] = raw_text.strip()

    return {
        "intent": default_intent,
        "answer": sections["answer"],
        "whyEvidence": sections["evidence"],
        "prediction": sections["prediction"],
        "recommendedAction": sections["recommendedAction"],
        "limitation": sections["limitation"],
        "raw": raw_text,
        "evidenceSources": evidence_list or []
    }
