import * as React from "react";
import { Col, ListGroup, Row, Tab } from "react-bootstrap";

export const Instruction = () => {
    return (
        <div className="row h-100">
            <div className="col"></div>
            <div className="col align-self-center">
                <h3>Instructions</h3>
                <ul>
                    <li>
                        <h5>1. API</h5>
                        <p>
                            There is an offline API module in 'src/api/' folder
                            to mock backend endpoints. In this module we've
                            implemented two endpoints for inspections and images
                            data fetching. You may need to design and implement
                            new endpoints in order to finish the task.
                        </p>
                    </li>
                    <li>
                        <h5>2. JavaScript or TypeScript</h5>
                        <p>
                            We recommend using TypeScript, but vanilla
                            JavaScript is also acceptable. You may notice that
                            the 'api' module is written in vanilla script, that
                            is because it mocks a backend communication.
                        </p>
                    </li>
                    <li>
                        <h5>3. Dom Style</h5>
                        <p>
                            Styling dom is a nice to have, but not mandatory. We
                            recommend to using bootstrap and react-bootstrap,
                            which has been preset in this repo.
                        </p>
                    </li>
                </ul>
            </div>
            <div className="col"></div>
        </div>
    );
};
