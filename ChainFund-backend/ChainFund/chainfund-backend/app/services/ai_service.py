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

    async def verify_proof_of_work(
        self, 
        milestone_title: str, 
        image_bytes: bytes = None,
        project_description: str = ""
    ) -> Dict[str, Any]:
        """
        Verifies if an image provides visual proof of a milestone completion.
        Uses Groq Vision API (llama-3.2-90b-vision-preview) for real analysis.
        Falls back to enhanced mock if API unavailable.
        """
        import random
        import asyncio
        import base64
        
        # If no client or no image, use enhanced mock
        if not self.client or not image_bytes:
            return await self._mock_verify_proof(milestone_title)
        
        try:
            # Convert image to base64
            b64_image = base64.b64encode(image_bytes).decode('utf-8')
            
            # Build verification prompt
            prompt = f"""You are an auditor for a sustainability crowdfunding platform.
Analyze this image as proof for milestone: "{milestone_title}"

Project context: {project_description[:500] if project_description else "Environmental sustainability project"}

Evaluate these criteria:
1. Does the image show relevant work being done?
2. Is there physical evidence of progress (people working, equipment, results)?
3. Any signs this could be a stock photo or AI-generated image?
4. Are there location clues matching project claims?

Return ONLY valid JSON with this exact structure:
{{
    "verified": true or false,
    "confidence": 0.0 to 1.0,
    "analysis": "detailed 2-3 sentence explanation",
    "objects_detected": ["list", "of", "visible", "objects"],
    "red_flags": ["any", "concerns", "or", "empty", "array"],
    "recommendation": "approve" or "needs_review" or "reject"
}}"""

            # Call Groq Vision API
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{b64_image}"
                                }
                            }
                        ]
                    }
                ],
                model="llama-3.2-90b-vision-preview",
                temperature=0.3,
                max_tokens=1024
            )
            
            result_text = chat_completion.choices[0].message.content
            
            # Parse JSON from response (handle markdown code blocks)
            if "```json" in result_text:
                result_text = result_text.split("```json")[1].split("```")[0]
            elif "```" in result_text:
                result_text = result_text.split("```")[1].split("```")[0]
            
            result = json.loads(result_text.strip())
            
            # Ensure required fields exist
            result.setdefault("verified", False)
            result.setdefault("confidence", 0.5)
            result.setdefault("analysis", "Analysis completed")
            result.setdefault("objects_detected", [])
            result.setdefault("red_flags", [])
            result.setdefault("recommendation", "needs_review")
            
            logger.info(f"✅ Groq Vision verified '{milestone_title}': {result['verified']} ({result['confidence']*100:.0f}%)")
            return result
            
        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse Groq Vision response: {e}")
            return await self._mock_verify_proof(milestone_title)
        except Exception as e:
            logger.error(f"Groq Vision API error: {e}")
            return await self._mock_verify_proof(milestone_title)
    
    async def _mock_verify_proof(self, milestone_title: str) -> Dict[str, Any]:
        """
        Enhanced mock verification for demo/fallback.
        Uses milestone keywords to provide more realistic responses.
        """
        import random
        import asyncio
        
        await asyncio.sleep(1.5)  # Simulate processing time
        
        # Keyword-based scoring for more realistic mock
        positive_keywords = ["plant", "install", "build", "clean", "solar", "tree", 
                           "recycle", "water", "forest", "wind", "energy"]
        milestone_lower = milestone_title.lower()
        
        has_positive = any(k in milestone_lower for k in positive_keywords)
        
        if has_positive:
            confidence = 0.82 + random.random() * 0.13  # 82-95%
            verified = True
            objects = ["equipment", "workers", "progress_visible", "site_conditions"]
        else:
            confidence = 0.55 + random.random() * 0.25  # 55-80%
            verified = random.random() > 0.25
            objects = ["generic_scene", "unclear_activity"]
        
        return {
            "verified": verified,
            "confidence": round(confidence, 2),
            "analysis": f"[Demo Mode] Verification for '{milestone_title}'. " + 
                       ("Image appears to show relevant progress." if verified 
                        else "Image requires manual review for confirmation."),
            "objects_detected": objects,
            "red_flags": [] if verified else ["low_confidence", "unclear_context"],
            "recommendation": "approve" if verified else "needs_review",
            "geotag_match": verified  # Keep for backwards compatibility
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
