import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Profile from './components/Profile';
import Timeline from './components/Timeline';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

function App() {
  return (
    <AppContainer>
      <Content>
        <Profile />
        <Timeline />
      </Content>
    </AppContainer>
  );
}

export default App; 