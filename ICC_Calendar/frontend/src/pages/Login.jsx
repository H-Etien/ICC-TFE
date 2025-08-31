import Form from "../components/Form";

// Indique au Form que c'est un formulaire de connexion - login
function Login() {
    return (
        <>
            <Form route="/api/token/" method="login" />
        </>
    );
}

export default Login;
