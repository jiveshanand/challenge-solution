import React, { useState } from 'react';
import {
  Button,
  Col,
  Form,
  Navbar,
  Row,
  Toast,
  ToastContainer,
} from 'react-bootstrap';
import { getImages } from '../api';

export const NavigationBar = ({
  setEnteredTagName,
  enteredTagName,
  inputRef,
  setInspections,
  setInspectionsToRender,
  setIsAllInspectionsExpanded,
  isAllInspectionsExpanded,
  setExpandedInspections,
  inspections,
  timerId,
  inspectionsToRender,
}) => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const updateTagNmes = (prevState) => {
    return prevState.map((inspection) => {
      return {
        ...inspection,
        tags: [...inspection.tags, enteredTagName],
      };
    });
  };
  return (
    <Navbar className='bg-body-tertiary justify-content-between'>
      <Form>
        <Row>
          <Col xs='auto'>
            <Form.Control
              onChange={(e) => {
                const pattern = /^[a-zA-Z0-9]*$/;
                if (pattern.test(e.target.value)) {
                  setEnteredTagName(e.target.value);
                }
                if (timerId) {
                  clearTimeout(timerId);
                }
              }}
              value={enteredTagName}
              type='text'
              placeholder='Filter By Tag Name'
              className=' mr-sm-2'
              ref={inputRef}
            />
          </Col>
          <Col xs='auto'>
            <Button
              type='button'
              onClick={() => {
                if (timerId) {
                  clearTimeout(timerId);
                }
                if (enteredTagName !== '') {
                  setInspections((prevState) => {
                    return prevState.map((inspection) => {
                      if (
                        inspectionsToRender.find(
                          (item) => item.id === inspection.id
                        )
                      ) {
                        return {
                          ...inspection,
                          tags: [...inspection.tags, enteredTagName],
                        };
                      }
                      return { ...inspection };
                    });
                  });
                  setInspectionsToRender(updateTagNmes);
                  setShowSuccessToast(true);
                }
              }}
            >
              Add Tag
            </Button>
          </Col>
        </Row>
      </Form>
      {inspectionsToRender && inspectionsToRender.length < 7 && (
        <Col xs='auto'>
          <Button
            onClick={() => {
              setInspectionsToRender(inspections);
              setEnteredTagName('');
              setExpandedInspections([]);
            }}
          >
            Show All
          </Button>
        </Col>
      )}
      <Col xs='auto'>
        <Button
          type='button'
          onClick={async () => {
            setIsAllInspectionsExpanded(!isAllInspectionsExpanded);
            if (!isAllInspectionsExpanded) {
              setExpandedInspections(
                inspectionsToRender.map((inspection) =>
                  inspection.id.toString()
                )
              );
              const updatedInspection = await Promise.all(
                inspectionsToRender.map(async (inspection) => {
                  const imageList = await getImages(inspection.id);
                  return { ...inspection, images: imageList };
                })
              );
              setInspectionsToRender(updatedInspection);
            } else {
              setExpandedInspections([]);
            }
          }}
        >
          {isAllInspectionsExpanded ? 'Collapse All' : 'Expand All'}
        </Button>
      </Col>
      <ToastContainer
        position='top-end'
        className='p-3'
        style={{ zIndex: 100 }}
      >
        <Toast
          onClose={() => setShowSuccessToast(false)}
          show={showSuccessToast}
          bg='success'
          autohide
        >
          <Toast.Header>
            <strong className='me-auto'>Successful</strong>
          </Toast.Header>
          <Toast.Body className='text-white'>
            Tag successfully added to the rendered List
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Navbar>
  );
};
