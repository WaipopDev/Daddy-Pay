"use client";

import React, { useMemo, useState } from "react";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ButtonSubmit from "@/components/Button/ButtonSubmit";
import { resetPassword } from "@/lib/auth";
import { useAppDispatch } from "@/store/hook";
import { openModalAlert } from "@/store/features/modalSlice";

const ResetPasswordForm = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const resetToken = searchParams.get("token")?.trim() || "";

    const [validated, setValidated] = useState(false);
    const [isProcess, setIsProcess] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [clientError, setClientError] = useState("");

    const tokenMissing = useMemo(() => !resetToken, [resetToken]);

    const validateClient = () => {
        if (!newPassword) {
            setClientError("New password is required");
            return false;
        }
        if (newPassword.length < 6) {
            setClientError("Password must be at least 6 characters");
            return false;
        }
        if (newPassword !== confirmPassword) {
            setClientError("Passwords do not match");
            return false;
        }
        setClientError("");
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (tokenMissing) return;

        const form = e.currentTarget;
        setValidated(true);

        if (form.checkValidity() === false) {
            e.stopPropagation();
            return;
        }

        if (!validateClient()) {
            return;
        }

        setIsProcess(true);
        try {
            const response = await resetPassword(resetToken, newPassword);
            const message =
                (response.data as { message?: string })?.message ||
                "Password has been reset successfully. Please sign in.";
            dispatch(openModalAlert({ message, title: "Reset Password" }));
            router.push("/login");
        } catch (err) {
            dispatch(openModalAlert({ message: err as string, title: "Reset Password" }));
        } finally {
            setIsProcess(false);
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
                                <h1 className="text-2xl md:text-4xl font-bold text-center mt-4">
                                    Reset Password
                                </h1>
                            </div>
                        </Col>
                    </Row>
                    <Row className="w-full">
                        <Col className="flex justify-center">
                            <div className="shadow-lg my-5 w-full max-w-md bg-white rounded-lg">
                                <div className="p-6">
                                    {tokenMissing ? (
                                        <div className="text-center">
                                            <p className="text-danger mb-3">
                                                Invalid or missing reset link. Please request a new password reset email.
                                            </p>
                                            <Link href="/login" className="text-blue-500 hover:text-blue-700">
                                                Back to Sign in
                                            </Link>
                                        </div>
                                    ) : (
                                        <Form
                                            onSubmit={handleSubmit}
                                            noValidate
                                            validated={validated}
                                        >
                                            <Form.Group className="mb-3" controlId="resetNewPassword">
                                                <Form.Label className="text-lg md:text-xl">New Password</Form.Label>
                                                <InputGroup className="mb-1">
                                                    <InputGroup.Text>
                                                        <i className="fa-solid fa-unlock-keyhole" />
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="New password"
                                                        name="newPassword"
                                                        value={newPassword}
                                                        onChange={(e) => {
                                                            setNewPassword(e.target.value);
                                                            if (clientError) setClientError("");
                                                        }}
                                                        minLength={6}
                                                        required
                                                        className="text-base"
                                                    />
                                                </InputGroup>
                                                <Form.Control.Feedback type="invalid">
                                                    Password must be at least 6 characters.
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="resetConfirmPassword">
                                                <Form.Label className="text-lg md:text-xl">Confirm Password</Form.Label>
                                                <InputGroup className="mb-1">
                                                    <InputGroup.Text>
                                                        <i className="fa-solid fa-unlock-keyhole" />
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="Confirm password"
                                                        name="confirmPassword"
                                                        value={confirmPassword}
                                                        onChange={(e) => {
                                                            setConfirmPassword(e.target.value);
                                                            if (clientError) setClientError("");
                                                        }}
                                                        minLength={6}
                                                        required
                                                        className="text-base"
                                                    />
                                                </InputGroup>
                                            </Form.Group>

                                            {clientError && (
                                                <p className="text-danger text-center mb-3">{clientError}</p>
                                            )}

                                            <Form.Group className="flex justify-center">
                                                <ButtonSubmit isProcess={isProcess} title="Reset Password" />
                                            </Form.Group>
                                        </Form>
                                    )}

                                    {!tokenMissing && (
                                        <div className="flex justify-center mt-3">
                                            <Link href="/login" className="text-blue-500 hover:text-blue-700 text-lg md:text-xl">
                                                Back to Sign in
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </main>
    );
};

export default ResetPasswordForm;
