import NavBar from '../Nav Bar/nav_bar';
import './page_Not_Found.css';

const Page_Not_Found = () => {
    return (
        <div>
            <div>
                <NavBar />
            </div>
            <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh", width: "100%" }}>
                <h1> 😔 404 page not found </h1>
            </div>
        </div>
    );
}

export default Page_Not_Found;
