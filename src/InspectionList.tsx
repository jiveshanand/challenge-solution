import React, { useState, useEffect, useRef } from 'react';
import { NavigationBar } from './components/NavBar';
import { getInspections, getImages } from './api';
import {
  Accordion,
  Badge,
  Col,
  Image,
  Row,
  Stack,
  Toast,
  ToastContainer,
} from 'react-bootstrap';

export const InspectionList = () => {
  const inputRef = useRef(null);

  const [inspections, setInspections] = useState(null);
  const [inspectionsToRender, setInspectionsToRender] = useState([]);
  const [expandedInspections, setExpandedInspections] = useState([]);
  const [isAllInspectionsExpanded, setIsAllInspectionsExpanded] =
    useState(false);
  const [enteredTagName, setEnteredTagName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const fetchInspections = async () => {
    const inspections = await getInspections();
    inspections.sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
    );
    setInspections(inspections);
    setInspectionsToRender(inspections);
  };

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }

    // uncomment the below code if fresh List needs to be fetched on clearing input box
    // if (enteredTagName === '') {
    //   setInspectionsToRender(inspections);
    // }

    if (inspections !== null && enteredTagName !== '') {
      const filteredArray = inspections.filter((inspection) => {
        return inspection.tags.includes(enteredTagName);
      });
      if (filteredArray && filteredArray.length > 0) {
        setInspectionsToRender(filteredArray);
      } else {
        setTimerId(
          setTimeout(() => {
            setShowToast(true);
          }, 5000)
        );
      }
    }
  }, [enteredTagName]);

  useEffect(() => {
    fetchInspections();
  }, []);

  const formatDate = (date) => {
    const dateToCompute = new Date(date);

    const year = dateToCompute.getFullYear();
    const month = String(dateToCompute.getMonth() + 1).padStart(2, '0');
    const day = String(dateToCompute.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  console.log('ExpandedInspections', inspections);
  return (
    <>
      <NavigationBar
        setEnteredTagName={setEnteredTagName}
        enteredTagName={enteredTagName}
        inputRef={inputRef}
        setInspections={setInspections}
        setInspectionsToRender={setInspectionsToRender}
        setIsAllInspectionsExpanded={setIsAllInspectionsExpanded}
        setExpandedInspections={setExpandedInspections}
        inspections={inspections}
        inspectionsToRender={inspectionsToRender}
        isAllInspectionsExpanded={isAllInspectionsExpanded}
        timerId={timerId}
      />
      <Accordion
        className='mx-5'
        defaultActiveKey={expandedInspections}
        activeKey={expandedInspections}
        onSelect={async (e: string[]) => {
          setExpandedInspections(e);
          const imageList = await getImages(e[e.length - 1]);

          setInspectionsToRender((prevState) => {
            return prevState.map((inspection) => {
              if (inspection.id.toString() === e[e.length - 1]) {
                return {
                  ...inspection,
                  images: imageList,
                };
              }
              return { ...inspection };
            });
          });
        }}
        alwaysOpen
      >
        {inspectionsToRender &&
          inspectionsToRender.map((inspection, index) => (
            <Accordion.Item eventKey={String(inspection.id)}>
              <Accordion.Header className='border rounded'>{`${
                inspection.type
              } Inspection- ${formatDate(
                new Date(inspection.date)
              )}`}</Accordion.Header>
              <Accordion.Body className='p-5'>
                <Stack direction='vertical' gap={3}>
                  <Row className='h4 font-weight-bold'>{`Inspection Status: ${inspection.status}`}</Row>
                  <Row className='h5 font-weight-bold'>{`Inspector: ${inspection.inspector}`}</Row>
                  <Row className='small'>{`Observations: ${inspection.observations}`}</Row>
                  <Row className='small'>
                    {`Tags: `}

                    {inspection?.tags.map((tag) => (
                      <Col>
                        {' '}
                        <Badge className='p-2' bg='secondary'>
                          {tag}
                          <span
                            className='border-0 text-white'
                            onClick={() => {
                              const inspectionstoUpdate = [
                                ...inspectionsToRender,
                              ];

                              const updateMasterData = [...inspections];
                              const indexToUpdate = updateMasterData.findIndex(
                                (item) => item.id === inspection.id
                              );
                              const filteredTags = updateMasterData[
                                indexToUpdate
                              ].tags.filter((tagName) => tagName !== tag);
                              updateMasterData[indexToUpdate].tags =
                                filteredTags;
                              console.log('filteredTags', filteredTags);
                              console.log('updateMasterData', updateMasterData);
                              setInspections(updateMasterData);

                              inspectionstoUpdate.splice(index, 1);
                              setInspectionsToRender(inspectionstoUpdate);
                              setExpandedInspections([]);
                            }}
                            style={{ marginLeft: '5px' }}
                          >
                            &#x2715;{' '}
                          </span>
                        </Badge>
                      </Col>
                    ))}
                  </Row>
                  <Row style={{ justifyContent: 'center', marginTop: '1rem' }}>
                    {inspection.images &&
                      inspection.images.length > 0 &&
                      inspection.images.map((image) => (
                        <Col className='text-center'>
                          <Image src={image.href} fluid />
                        </Col>
                      ))}
                  </Row>
                </Stack>
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
      <ToastContainer position='top-end' className='p-3' style={{ zIndex: 1 }}>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={5000}
          bg='danger'
          autohide
        >
          <Toast.Header>
            <img
              src='holder.js/20x20?text=%20'
              className='rounded me-2'
              alt=''
            />
            <strong className='me-auto'>Do you want to add a new Tag?</strong>
          </Toast.Header>
          <Toast.Body className='text-white'>
            Uh Oh! We could not find any relevant item for enetered Tag Name, Do
            you want to add a new Tag in the rendered List?
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};
