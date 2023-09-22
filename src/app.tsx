import * as React from 'react';
// import { Instruction } from './instructions/instruction';
import { InspectionList } from './InspectionList';
import { Col, Container, Row, Stack } from 'react-bootstrap';

export const App = () => {
  return (
    <React.StrictMode>
      <Container fluid>
        <Stack direction='vertical' gap={5} className='mx-5'>
          <InspectionList />
        </Stack>
      </Container>
    </React.StrictMode>
  );
};
