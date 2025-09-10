import { Link } from "react-router-dom";

import Form from "../components/Form";

function Register() {
    return (
        <>
            <Form route="/api/user/register/" method="register" />
            <p>
                Déjà un compte ?{" "}
                <Link to="/login">
                    <button>Se connecter</button>
                </Link>
            </p>
        </>
    );
}

export default Register;
