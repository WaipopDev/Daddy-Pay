import React, { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordPage = () => {
    return (
        <Suspense fallback={null}>
            <ResetPasswordForm />
        </Suspense>
    );
};

export default ResetPasswordPage;
