import not_found from "../assets/NotFound/not_found.png";

function NotFound() {
    return (
        <div>
            <h1>404 Not Found</h1>
            <img src={not_found} alt="Not Found" />
        </div>
    );
}

export default NotFound;
