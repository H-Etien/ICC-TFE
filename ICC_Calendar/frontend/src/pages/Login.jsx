import { Link } from "react-router-dom";

import Form from "../components/Form";

// Indique au Form que c'est un formulaire de connexion - login
function Login() {
    return (
        <>
            <Form route="/api/token/" method="login" />
            <p>
                Pas encore de compte ?{" "}
                <Link to="/register">
                    <button>S’inscrire</button>
                </Link>
            </p>
        </>
    );
}

export default Login;
