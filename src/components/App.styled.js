// Styled components
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  background: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  margin: auto;
  margin-top: 50px;
`;

export const Title = styled.h1`
  font-size: 24px;
  color: #333;
`;

export const WeatherInfo = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
`;

export const Temperature = styled.p`
  font-size: 48px;
  margin: 10px 0;
  color: #333;
`;

export const Description = styled.p`
font-size: 18px;
color: #555;
`;

export const AdditionalInfo = styled.div`
margin-top: 10px;
text-align: left;
`;

export const InfoItem = styled.p`
margin: 5px 0;
color: #555;
`;



/* //App.css
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
} */
