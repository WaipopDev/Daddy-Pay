"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Modal, Row } from "react-bootstrap";
import Image from "next/image";
import ButtonSubmit from "@/components/Button/ButtonSubmit";
import { forgotPassword, login } from "@/lib/auth";
import { useAppDispatch } from "@/store/hook";
import { openModalAlert, setProcess } from "@/store/features/modalSlice";
import { useRouter, useSearchParams } from "next/navigation";

const LoginForm = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [validated, setValidated] = useState(false);
    const [isProcess, setIsProcess] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotValidated, setForgotValidated] = useState(false);
    const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
    const error = searchParams.get("error");
    const v = searchParams.get("v");

    useEffect(() => {
        if (error === "token" && v) {
            dispatch(
                openModalAlert({
                    message: "Session expired, please login again",
                    title: "Alert Message",
                })
            );
            const currentPath = window.location.pathname;
            router.replace(currentPath); // ลบ query โดยไม่ reload
        }
    }, [error, v, dispatch, router]);

    const handdleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        setValidated(true);
        // const formData = new FormData(form);
        // const data = {
        //     user: formData.get('user'),
        //     password: formData.get('password')
        // }
        // console.log('data', data)
        if (form.checkValidity() === true) {
            setIsProcess(true);
            try {
                const username = form.user.value;
                const password = form.password.value;
                const response = await login(username, password);
                if (response.status === 200) {
                    router.push("/dashboard");
                    dispatch(setProcess(false));
                }
                setIsProcess(false);
                setValidated(true);
            } catch (error) {
                setIsProcess(false);
                console.log("Error:", error);
                dispatch(openModalAlert({ message: error as string, title: "Alert Message" }));
                // alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
            }
        }
    };

    const handleCloseForgotModal = () => {
        setShowForgotModal(false);
        setForgotEmail("");
        setForgotValidated(false);
        setIsForgotSubmitting(false);
    };

    const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setForgotValidated(true);
            return;
        }
        setForgotValidated(true);
        setIsForgotSubmitting(true);
        try {
            const response = await forgotPassword(forgotEmail.trim());
            const message =
                (response.data as { message?: string })?.message ||
                "If this email is registered, a password reset link has been sent.";
            handleCloseForgotModal();
            dispatch(openModalAlert({ message, title: "Forgot Password" }));
        } catch (err) {
            dispatch(openModalAlert({ message: err as string, title: "Forgot Password" }));
        } finally {
            setIsForgotSubmitting(false);
        }
    };

    return (
        <main className="main-login">
            <Container>
                <div className="flex flex-col justify-center items-center min-h-screen px-4">
                    <Row className="w-full">
                        <Col className="flex justify-center items-center">
                            <div className="flex flex-col justify-center items-center">
                                <Image 
                                    src="/images/logo-2.png" 
                                    width={250} 
                                    height={300} 
                                    priority 
                                    alt="logo"
                                    className="w-32 h-34 md:w-60 md:h-64"
                                />
                                <h1 className="text-2xl md:text-4xl font-bold text-center mt-4">Sign in to Daddy Pay</h1>
                            </div>
                        </Col>
                    </Row>
                    <Row className="w-full">
                        <Col className="flex justify-center">
                            <div className="shadow-lg my-5 w-full max-w-md bg-white rounded-lg">
                                <div className="p-6">

                                    <Form onSubmit={(e) => handdleSubmit(e)} noValidate validated={validated}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label className="text-lg md:text-xl">Username</Form.Label>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text id="basic-addon1"><i className="fa-solid fa-user"></i></InputGroup.Text>
                                                <Form.Control 
                                                    type="text" 
                                                    placeholder="Username" 
                                                    name="user" 
                                                    required 
                                                    className="text-base"
                                                />
                                            </InputGroup>

                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label className="text-lg md:text-xl">Password</Form.Label>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text id="basic-addon1"><i className="fa-solid fa-unlock-keyhole"></i></InputGroup.Text>
                                                <Form.Control 
                                                    type="password" 
                                                    placeholder="Password" 
                                                    name="password" 
                                                    required 
                                                    className="text-base"
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="flex justify-center">
                                            <ButtonSubmit isProcess={isProcess} title="Sign in" />
                                        </Form.Group>
                                    </Form>
                                    <div className="flex justify-center mt-3">
                                        <button
                                            type="button"
                                            className="text-lg md:text-xl text-blue-500 hover:text-blue-700 bg-transparent border-0 p-0"
                                            onClick={() => setShowForgotModal(true)}
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>

            <Modal show={showForgotModal} onHide={handleCloseForgotModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Forgot Password</Modal.Title>
                </Modal.Header>
                <Form
                    noValidate
                    validated={forgotValidated}
                    onSubmit={handleForgotSubmit}
                >
                    <Modal.Body>
                        <p className="text-muted mb-3">
                            Enter your email address. We will send you a link to reset your password.
                        </p>
                        <Form.Group controlId="forgotPasswordEmail">
                            <Form.Label>Email</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>
                                    <i className="fa-solid fa-envelope" />
                                </InputGroup.Text>
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    required
                                />
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid email address.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseForgotModal} disabled={isForgotSubmitting}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isForgotSubmitting}>
                            {isForgotSubmitting ? "Sending..." : "Send"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </main>
    )
}

export default LoginForm;