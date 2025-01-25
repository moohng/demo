import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const ProfileContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 60px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
`;

const Avatar = styled(motion.img)`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;

const Info = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  font-size: 2.4em;
  margin: 0 0 10px;
  color: #2d3436;
`;

const Title = styled.h2`
  font-size: 1.2em;
  color: #636e72;
  margin: 0;
  font-weight: normal;
`;

const Bio = styled.div`
  line-height: 1.8;
  color: #2d3436;
  margin-bottom: 30px;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Tag = styled(motion.span)`
  padding: 6px 16px;
  background: #6c5ce7;
  color: white;
  border-radius: 20px;
  font-size: 0.9em;
`;

function Profile() {
  return (
    <ProfileContainer>
      <Header>
        <Avatar
          src="/avatar.jpg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
        <Info>
          <Name>John Doe</Name>
          <Title>Full Stack Developer / Designer</Title>
        </Info>
      </Header>
      
      <Bio>
        热爱创造和分享的全栈开发者，专注于用户体验与工程效率的提升。
        擅长前端开发与交互设计，热衷于将复杂的问题简单化。
        喜欢探索新技术，乐于分享技术经验。
      </Bio>
      
      <Tags>
        {['React', 'TypeScript', 'Node.js', 'UI/UX', 'WebGL'].map((tag, i) => (
          <Tag
            key={tag}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {tag}
          </Tag>
        ))}
      </Tags>
    </ProfileContainer>
  );
}

export default Profile; 