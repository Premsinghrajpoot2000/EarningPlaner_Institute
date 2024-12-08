import './Loading.css';

const Loading = () => {
    return (
        <div className="loading-dark-container d-flex justify-content-center align-items-center vh-100 vw-100">
            <div className="text-center">
                <i className="fa-solid fa-spinner fa-spin spinner-dark-icon"></i>
                <p className="fs-5 text-white">Loading...</p>
            </div>
        </div>
    );
}
 
export default Loading;
