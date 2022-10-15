import styled from "styled-components";

export const AppWrapper = styled.div`
display: flex;
flex-direction: column;
`;

export const ErrorMessage = styled.div`
font-size: 1.2rem;
padding: 0.5rem 0;
`;

export const ErrorPayload = styled.div`
font-size: 0.9rem;
padding: 0.5rem 0;
`;

export const ErrorStatus = styled.div`
font-size: 3.5rem;
padding: 0.5rem 0;
`;

export const ErrorWrapper = styled.div`
padding: 10%;
`;

export const Overlay = styled.div`
align-items: center;
display: flex;
flex: 1 1;
flex-direction: column;
height: 100%;
justify-content: center;
left: 0;
position: fixed;
top: 0;
width: 100%;
`;

export const LoadingMessage = styled.div`
font-size: 30px;
padding-bottom: 32px;
`;