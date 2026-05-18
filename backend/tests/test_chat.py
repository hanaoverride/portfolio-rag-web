class DummySecret:
    def __init__(self, value: str):
        self._value = value

    def get_secret_value(self) -> str:
        return self._value


def _patch_settings(monkeypatch, settings_obj):
    # Patch app.config.settings used by the factory
    import app.config as config_module

    monkeypatch.setattr(config_module, "settings", settings_obj, raising=False)


def test_stub_chat_service_when_demo_mode_true(monkeypatch):
    from app.llm.stub_chat_service import StubChatService, get_chat_service

    # Ensure we simulate demo mode via runtime settings
    class SettingsLike:
        def __init__(self):
            self.demo_mode = True
            self.openai_api_key = None
            self.openai_api_base = "https://openrouter.ai/api/v1"
            self.openai_chat_model = "gpt-oss-120b"

    _patch_settings(monkeypatch, SettingsLike())
    service = get_chat_service()
    assert isinstance(service, StubChatService)


def test_real_chat_service_created_with_openai_key(monkeypatch):
    from app.llm.chat_service import RealChatService
    from app.llm.stub_chat_service import get_chat_service

    # Patch AsyncOpenAI to avoid real API calls
    class DummyClient:
        def __init__(self, api_key=None, base_url=None):
            self.api_key = api_key
            self.base_url = base_url

    import app.llm.chat_service as chat_service_module

    monkeypatch.setattr(chat_service_module, "AsyncOpenAI", DummyClient)

    # Provide settings with OpenAI API key and demo_mode = False
    class SettingsLike:
        def __init__(self):
            self.demo_mode = False
            self.openai_api_key = DummySecret("OPENAI-KEY-456")
            self.openai_api_base = "https://openrouter.ai/api/v1"
            self.openai_chat_model = "gpt-oss-120b"

    _patch_settings(monkeypatch, SettingsLike())

    service = get_chat_service()
    assert isinstance(service, RealChatService)
    assert service._api_key == "OPENAI-KEY-456"
    assert service._client is not None


def test_chat_completion_request_schema_with_messages():
    from app.data.schemas import ChatCompletionRequest, ChatMessagePayload

    req = ChatCompletionRequest(
        messages=[
            ChatMessagePayload(role="user", content="Hello"),
            ChatMessagePayload(role="assistant", content="Hi there!"),
        ]
    )
    assert len(req.messages) == 2
    assert req.messages[0].role == "user"
    assert req.messages[0].content == "Hello"


def test_chat_completion_request_schema_default_values():
    from app.data.schemas import ChatCompletionRequest

    req = ChatCompletionRequest()
    assert req.messages == []
    assert req.stream is False
    assert req.temperature is None


def test_chat_completion_request_schema_with_temperature():
    from app.data.schemas import ChatCompletionRequest, ChatMessagePayload

    req = ChatCompletionRequest(
        messages=[ChatMessagePayload(role="user", content="Hello")],
        temperature=0.7,
        stream=False,
    )
    assert req.temperature == 0.7
    assert req.stream is False


def test_chat_message_payload_default_values():
    from app.data.schemas import ChatMessagePayload

    msg = ChatMessagePayload()
    assert msg.role == "user"
    assert msg.content == ""
