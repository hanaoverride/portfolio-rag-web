import logging
from datetime import datetime

import resend

from app.config import settings

logger = logging.getLogger(__name__)

if settings.resend_api_key:
    resend.api_key = settings.resend_api_key.get_secret_value()

def send_password_reset_email(to_email: str, reset_link: str) -> bool:
    """사용자에게 비밀번호 재설정 링크를 발송합니다."""
    if not settings.resend_api_key:
        logger.warning("RESEND_API_KEY is not configured. Email sending skipped.")
        return False

    html_content = f"""
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #4f46e5; margin-bottom: 16px;">비밀번호 재설정 요청</h2>
        <p style="font-size: 14px; color: #334155; line-height: 1.5;">
            안녕하세요. Layer입니다.<br>
            계정의 비밀번호 재설정 요청을 받았습니다. 아래 버튼을 클릭하여 새 비밀번호를 설정해주세요.
        </p>
        <div style="margin: 24px 0; text-align: center;">
            <a href="{reset_link}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 14px;">
                비밀번호 재설정하기
            </a>
        </div>
        <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
            본 링크는 <strong>1시간 동안만 유효</strong>합니다. 만약 본인이 요청한 것이 아니라면 이 메일을 무시하셔도 안전합니다.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">
            © {datetime.now().year} Layer. All rights reserved.
        </p>
    </div>
    """

    try:
        params = {
            "from": settings.mail_from,
            "to": [to_email],
            "subject": "[Layer] 계정 비밀번호 재설정 링크 안내",
            "html": html_content,
        }
        resend.Emails.send(params)
        logger.info("비밀번호 재설정 메일 발송 성공 (To: %s)", to_email)
        return True
    except Exception as e:
        logger.error("Resend 메일 발송 실패 (To: %s): %s", to_email, str(e))
        return False
