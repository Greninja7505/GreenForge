import os
import json
import logging
from typing import Dict, Any, Optional
from app.config import settings

# Try to import Groq, but fail gracefully if not installed
try:
    from groq import Groq
except ImportError:
    Groq = None

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = settings.groq_api_key
        self.client = None
        
        if self.api_key and Groq:
            try:
                self.client = Groq(api_key=self.api_key)
                logger.info("✅ Groq AI Client initialized successfully")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Groq client: {e}")
        else:
            logger.warning("⚠️ Groq API Key missing or library not installed. AI features will use mock data.")

    async def analyze_sustainability(self, title: str, description: str, category: str) -> Dict[str, Any]:
        """
        Analyzes a project proposal for sustainability credibility ("Greenwashing Detection").
        Returns a JSON object with score, feedback, and classification.
        """
        
        # Fallback to mock if client not available
        if not self.client:
            return self._mock_analysis(title, description)

        prompt = f"""
        You are an expert Scientific Auditor for a Regenerative Finance platform. 
        Your job is to detect "Greenwashing" in project funding proposals.
        
        Analyze the following project:
        Title: {title}
        Category: {category}
        Description: {description}
        
        Evaluate it on:
        1. Specificity (Are there concrete metrics?)
        2. Impact (Is the ecological benefit clear?)
        3. Feasibility (Is it realistic?)
        
        Return pure JSON with this structure:
        {{
            "score": <integer 0-100>,
            "credibility_level": <"High" | "Medium" | "Low" | "Suspicious">,
            "flags": [<list of strings (concerns)>],
            "suggestions": [<list of strings (improvements)>],
            "impact_metrics": [<list of inferred metrics, e.g. "CO2 reduction">],
            "summary": "<1 sentence verdict>"
        }}
        """

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a rigid scientific auditor. Return ONLY valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama3-70b-8192",
                temperature=0.3,
                max_tokens=1024,
                response_format={"type": "json_object"}
            )
            
            result_json = chat_completion.choices[0].message.content
            return json.loads(result_json)

        except Exception as e:
            logger.error(f"Error calling Groq API: {e}")
            return self._mock_analysis(title, description)

    async def verify_proof_of_work(self, milestone_title: str, image_bytes: bytes = None) -> Dict[str, Any]:
        """
        Verifies if an image provides visual proof of a milestone completion.
        Simulates Computer Vision analysis.
        """
        # In a real hackathon flow, you'd send base64 image to GPT-4o or LLaVA.
        # Here we simulate the AI "Audit" process for the demo.
        
        import random
        import asyncio
        
        # Simulate processing time
        await asyncio.sleep(2)
        
        success = random.random() > 0.1 # 90% success rate for demo
        
        if success:
            return {
                "verified": True,
                "confidence": 0.95,
                "analysis": f"AI Verification Successful: Image content matches milestone '{milestone_title}'. Identified: relevant physical evidence, location data consistency.",
                "objects_detected": ["sapling", "gloves", "soil", "human_hand"],
                "geotag_match": True
            }
        else:
            return {
                "verified": False,
                "confidence": 0.20,
                "analysis": "AI Verification Failed: Image appears unrelated or blurry. Please upload a clear photo of the completed work.",
                "objects_detected": ["unknown_blur", "indoor_wall"],
                "geotag_match": False
            }

    def _mock_analysis(self, title: str, description: str) -> Dict[str, Any]:
        """
        Fallback mock analysis for development/testing without API keys.
        """
        word_count = len(description.split())
        
        # Simple heuristic for the mock
        if word_count < 20:
            score = 30
            level = "Low"
            flags = ["Description is too short to evaluate", "Lacks specific metrics"]
        elif "CO2" in description or "trees" in description or "ocean" in description:
            score = 85
            level = "High"
            flags = []
        else:
            score = 60
            level = "Medium"
            flags = ["General claims detected without specific scientific backing"]
            
        return {
            "score": score,
            "credibility_level": level,
            "flags": flags,
            "suggestions": [
                "Include estimated CO2 reduction in tonnes/year",
                "Add location-specific ecological data",
                "Reference scientific studies supporting this method"
            ],
            "impact_metrics": ["Community Engagement", "Environmental Awareness"],
            "summary": "Mock Analysis: Project appears relevant but requires more specific data for deeper verification."
        }

# Singleton instance
ai_service = AIService()
