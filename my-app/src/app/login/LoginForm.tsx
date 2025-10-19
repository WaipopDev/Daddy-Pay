"use client";
import React, { useEffect, useState } from "react";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import Image from "next/image";
import ButtonSubmit from "@/components/Button/ButtonSubmit";
import Link from "next/link";
import { login } from "@/lib/auth";
import { useAppDispatch } from "@/store/hook";
import { openModalAlert, setProcess } from "@/store/features/modalSlice";
import { useRouter, useSearchParams } from "next/navigation";

const LoginForm = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [validated, setValidated] = useState(false);
    const [isProcess, setIsProcess] = useState(false);
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

    return (
        <main className="main-login">
            <Container>
                <div className="flex flex-col justify-center items-center min-h-screen px-4">
                    <Row className="w-full">
                        <Col className="flex justify-center items-center">
                            <div className="flex flex-col justify-center items-center">
                                <Image 
                                    src="/images/logo.png" 
                                    width={250} 
                                    height={250} 
                                    priority 
                                    alt="logo"
                                    className="w-32 h-32 md:w-60 md:h-60"
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
                                        <Link href="/forgot-password" className="text-center text-blue-500 hover:text-blue-700">
                                            <p className="text-lg md:text-xl">Forgot Password?</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </main>
    )
}

export default LoginForm;