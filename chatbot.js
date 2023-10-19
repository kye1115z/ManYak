// 채팅 메시지를 표시할 DOM
const chatMessages = document.querySelector('#chat-messages');
// 사용자 입력 필드
const userInput = document.querySelector('#user-input input');
// 전송 버튼
const sendButton = document.querySelector('#user-input button');

// 발급받은 OpenAI API 키를 변수로 저장
const apiKey = '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';
// OpenAI API 엔드포인트 주소를 변수로 저장
const apiEndpoint = 'https://api.openai.com/v1/chat/completions'
function addMessage(sender, message) {
    // 새로운 div 생성
    const messageElement = document.createElement('div');
    // 생성된 요소에 클래스 추가
    messageElement.className = 'message';
     // 채팅 메시지 목록에 새로운 메시지 추가
    messageElement.textContent = `${sender}: ${message}`;
    chatMessages.prepend(messageElement);
}

// ChatGPT API 요청
async function fetchAIResponse(prompt) {
    // API 요청에 사용할 옵션을 정의
    const requestOptions = {
        method: 'POST',
        // API 요청의 헤더를 설정
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",  // 사용할 AI 모델
            messages: [
                {"role": "system", "content": "You are a kind helpful assistant."},
                {"role": "system", "content": "You are an expert on health supplements."},
                {"role": "system", "content": "The user will tell you the body parts that need improvement."},
                {"role": "system", "content": "If the user tells you that '관절 아파', say '첫 번째 추천은 [닥터스 베스트], 두 번째 추천은 [라이프 익스텐션], 그리고 세 번째 추천은 [자관원]."},
                {"role": "system", "content": "If a user says '눈', say '첫 번째 추천은 [굿 아이], 두 번째 추천은 [토비콤], 그리고 세 번째 추천은 [아이케어]."},
                // 말 덧붙임
                {"role": "system", "content": "Just say what I told you to do and don't add anything else"}, 
                {
                    role: "user", // 메시지 역할을 user로 설정
                    content: prompt // 사용자가 입력한 메시지
                }, 
            ],
            temperature: 0.1, // 모델의 출력 다양성
            max_tokens: 100, // 응답받을 메시지 최대 토큰(단어) 수 설정
            top_p: 1, // 토큰 샘플링 확률을 설정
            frequency_penalty: 0.5, // 일반적으로 나오지 않는 단어를 억제하는 정도
            presence_penalty: 0.5, // 동일한 단어나 구문이 반복되는 것을 억제하는 정도
            stop: ["stop"], // 생성된 텍스트에서 종료 구문을 설정
        }),
    };
    // API 요청후 응답 처리
    try {
        const response = await fetch(apiEndpoint, requestOptions);
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        return aiResponse;
    } catch (error) {
		console.error('OpenAI API 호출 중 오류 발생:', error);
        return 'OpenAI API 호출 중 오류 발생';
    }
}

// 전송 버튼 클릭 이벤트 처리
sendButton.addEventListener('click', async () => {
    // 사용자가 입력한 메시지
    const message = userInput.value.trim();
    // 메시지가 비어있으면 리턴
    if (message.length === 0) return;
    // 사용자 메시지 화면에 추가
    addMessage('나', message);
    userInput.value = '';
    //ChatGPT API 요청후 답변을 화면에 추가
    const aiResponse = await fetchAIResponse(message);
    addMessage('챗봇', aiResponse);
});

// 사용자 입력 필드에서 Enter 키 이벤트를 처리
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});