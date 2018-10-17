import React from 'react';

// 사용자 로그인 정보를 전역적으로 사용하기 위해 Context 사용
// Context 는 createContext 라는 함수를 사용해서 만들며, 이 함수를 호출하면 Provider 와 Consumer 라는 컴포넌트들이 반환
// Provider 는 Context 에서 사용 할 값을 설정할 때 사용
// Consumer 는 나중에 내가 설정한 값을 불러와야 할 때 사용
const AuthUserContext = React.createContext(null);

export default AuthUserContext;