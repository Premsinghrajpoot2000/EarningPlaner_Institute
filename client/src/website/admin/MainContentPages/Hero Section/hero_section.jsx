import { useState, useEffect, useRef } from 'react';
import './hero_section.css';
import axios from 'axios';
import Loading from '../../../user/Loading/Loading';

function HeroSection() {
    const [inputs, setInputs] = useState([{ text: '' }]);
    const [images, setImages] = useState([null]);
    const [imageErrors, setImageErrors] = useState(['']);
    const [formErrors, setFormErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState([false]);
    const [loading, setLoading] = useState(true);
    const [existingData, setExistingData] = useState([]);
    const [allDataGet, setAllDataGet] = useState([]);
    const [successMessage, setSuccessMessage] = useState(''); // Initialize as empty string
    const [deleting, setDeleting] = useState([false]); // State for deletion loading

    const fileInputRefs = useRef([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/hero/heroGet`);
                const heroSections = response.data.msg.reverse();

                const typingTextArray = heroSections.map(section => section.typingText);
                const imagesArray = heroSections.map(section => section.images);

                setAllDataGet(heroSections);
                setInputs(typingTextArray.map(text => ({ text })));
                setImages(imagesArray);
                setImageErrors(new Array(imagesArray.length).fill(''));
                setFormErrors(new Array(typingTextArray.length).fill(''));
                setExistingData(typingTextArray);
                setIsSubmitting(new Array(imagesArray.length).fill(false));
                setDeleting(new Array(heroSections.length).fill(false)); // Initialize deleting state
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (index, event) => {
        const newInputs = [...inputs];
        newInputs[index].text = event.target.value;
        setInputs(newInputs);
    };

    const addInput = () => {
        setInputs([...inputs, { text: '' }]);
        setImages([...images, null]);
        setImageErrors([...imageErrors, '']);
        setIsSubmitting([...isSubmitting, false]);
        setDeleting([...deleting, false]); // Add state for the new input
    };

    const removeInput = async (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) {
            return; // Exit if the user cancels
        }

        if (allDataGet[index]) { // Check if it has an ID
            setDeleting((prev) => {
                const newDeleting = [...prev];
                newDeleting[index] = true; // Set deleting state for this input
                return newDeleting;
            });

            try {
                await axios.delete(`${import.meta.env.VITE_SERVER_URL}/hero/heroDelete?objId=${allDataGet[index]._id}`);
                alert("Deletion successful!"); // Show success message
                setSuccessMessage('Deletion successful!'); // Set success message
            } catch (error) {
                console.error(error);
            } finally {
                setDeleting((prev) => {
                    const newDeleting = [...prev];
                    newDeleting[index] = false; // Reset deleting state
                    return newDeleting;
                });
            }
        }

        const newInputs = inputs.filter((_, i) => i !== index);
        const newImages = images.filter((_, i) => i !== index);
        const newErrors = imageErrors.filter((_, i) => i !== index);
        const newSubmitting = isSubmitting.filter((_, i) => i !== index);
        const newDeleting = deleting.filter((_, i) => i !== index); // Adjust deleting state

        setInputs(newInputs);
        setImages(newImages);
        setImageErrors(newErrors);
        setIsSubmitting(newSubmitting);
        setDeleting(newDeleting); // Update deleting state
    };

    const handleImageUpload = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                if (img.width === 1280 && img.height === 720) {
                    const newImages = [...images];
                    newImages[index] = file;
                    setImages(newImages);
                    setImageErrors((prev) => {
                        const newErrors = [...prev];
                        newErrors[index] = '';
                        return newErrors;
                    });
                } else {
                    const newErrors = [...imageErrors];
                    newErrors[index] = 'Image must be 1280x720 pixels.';
                    setImageErrors(newErrors);

                    const newImages = [...images];
                    newImages[index] = null;
                    setImages(newImages);
                    event.target.value = null; // Reset the file input
                }
            };
        }
    };

    const handleSubmit = async (index) => {
        const newFormErrors = [];

        if (!inputs[index].text || (!images[index] && !imageErrors[index])) {
            newFormErrors[index] = 'Both text and image are required.';
        }

        if (newFormErrors.some(error => error)) {
            setFormErrors(newFormErrors);
            return;
        }

        const confirmSubmit = window.confirm("Are you sure you want to submit?");
        if (!confirmSubmit) {
            return; // Exit if the user cancels
        }

        const formData = new FormData();
        const textToSubmit = inputs[index].text !== existingData[index] ? inputs[index].text : existingData[index];
        formData.append('texts', textToSubmit);

        if (images[index]) {
            formData.append('images', images[index]);
        }

        const newSubmitting = [...isSubmitting];
        newSubmitting[index] = true;
        setIsSubmitting(newSubmitting);

        try {
            await axios.patch(`${import.meta.env.VITE_SERVER_URL}/hero/heroEdit?id=${allDataGet[index] ? allDataGet[index]._id : ""}`, formData);
            setSuccessMessage('Submission successful!');

            // Reset image and error for the submitted index
            const newImages = [...images];
            newImages[index] = null; // Reset the image field
            setImages(newImages);
            setImageErrors((prev) => {
                const newErrors = [...prev];
                newErrors[index] = ''; // Clear the error message
                return newErrors;
            });

            // Reset the file input value
            if (fileInputRefs.current[index]) {
                fileInputRefs.current[index].value = null; // Clear the input field
            }

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error(error);
        } finally {
            newSubmitting[index] = false;
            setIsSubmitting(newSubmitting);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div
        className='scroll_style' style={{
            background: "#dadada",
            paddingBottom: "20px",
            height: "100vh",
            overflow: "auto"
        }}
        >
            <div className="container my-4">
                <h2 className="mb-4">Edit Hero Section</h2>
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <div className="p-4 border rounded bg-white shadow">
                    {inputs.map((input, index) => (
                        <div className="mb-3" key={index}>
                            <div className="input-group mb-2">
                                <img src={images[index]} alt={input.text} style={{width:"100%",marginBottom:"10px",borderRadius:"20px"}} />
                                <input
                                    type="text"
                                    className="form-control z-0"
                                    placeholder="Typing Text"
                                    value={input.text}
                                    onChange={(e) => handleInputChange(index, e)}
                                    required
                                />
                                <button
                                    className="btn btn-danger z-0"
                                    onClick={() => removeInput(index)}
                                    type="button"
                                    disabled={inputs.length === 1 && index === 0 || deleting[index]} // Disable if it's the only input or if deleting
                                >
                                    {deleting[index] ? 'Deleting...' : 'Delete'}
                                </button>
                                {formErrors[index] && (
                                    <div className="text-danger mt-2 mx-3">{formErrors[index]}</div>
                                )}
                            </div>
                            <div className="input-group mb-2">
                                <input
                                    type="file"
                                    className="form-control z-0"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(index, e)}
                                    ref={(el) => fileInputRefs.current[index] = el} // Set ref
                                    required={!images[index]} // Only require if no image exists
                                />
                                {imageErrors[index] && (
                                    <div className="text-danger mt-2 mx-3">{imageErrors[index]}</div>
                                )}
                            </div>
                            <button
                                className="btn btn-success w-100"
                                onClick={() => handleSubmit(index)}
                                type="button"
                                disabled={isSubmitting[index]}
                            >
                                {isSubmitting[index] ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    ))}
                    <button className="btn btn-primary mb-3" onClick={addInput} type="button">
                        Add Input
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;
