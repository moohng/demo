import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TimelineContainer = styled.div`
  position: relative;
  padding: 20px 0;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: rgba(108, 92, 231, 0.2);
  }
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  justify-content: ${props => props.align === 'left' ? 'flex-start' : 'flex-end'};
  padding: 20px 0;
  width: 100%;
`;

const Content = styled.div`
  width: 45%;
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    ${props => props.align === 'left' ? 'right: -10px' : 'left: -10px'};
    width: 20px;
    height: 20px;
    background: white;
    transform: rotate(45deg);
  }
`;

const Dot = styled(motion.div)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6c5ce7;
  border: 4px solid white;
  box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.2);
`;

const Title = styled.h3`
  margin: 0 0 10px;
  color: #2d3436;
`;

const Period = styled.div`
  font-size: 0.9em;
  color: #6c5ce7;
  margin-bottom: 15px;
`;

const Description = styled.div`
  color: #636e72;
  line-height: 1.6;
`;

const events = [
  {
    title: "高级前端开发工程师",
    period: "2022 - 至今",
    description: "负责团队核心项目的架构设计和技术选型，推动前端工程化建设，提升团队开发效率。",
    align: "right"
  },
  {
    title: "个人作品 - 在线协作工具",
    period: "2021",
    description: "使用 WebRTC 技术开发的实时协作工具，支持多人同时编辑和音视频通话。",
    align: "left"
  },
  // ... 更多事件
];

function Timeline() {
  return (
    <TimelineContainer>
      {events.map((event, index) => {
        const [ref, inView] = useInView({
          triggerOnce: true,
          threshold: 0.1,
        });
        
        return (
          <TimelineItem
            key={index}
            ref={ref}
            align={event.align}
            initial={{ opacity: 0, x: event.align === 'left' ? -50 : 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Content align={event.align}>
              <Title>{event.title}</Title>
              <Period>{event.period}</Period>
              <Description>{event.description}</Description>
            </Content>
            <Dot
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: index * 0.2 + 0.3 }}
            />
          </TimelineItem>
        );
      })}
    </TimelineContainer>
  );
}

export default Timeline; 