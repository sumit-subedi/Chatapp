import React from "react";

function TermsModal({ onClose, onAccept }) {
    const handleOutsideClick = (e) => {
        if (e.target.id === "modal-overlay") {
            onClose();
        }
    };

    return (
        <div
            id="modal-overlay"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOutsideClick}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg relative">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Terms and Conditions
                </h2>
                <p className="text-gray-600 mb-4">
                    By using this platform, you agree to the following terms:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                    <li>Do not use the platform for illegal activities.</li>
                    <li>Respect other users and avoid harassment.</li>
                    <li>No spam, advertisements, or malicious content.</li>
                    <li>The platform is provided "as-is" without warranties.</li>
                    <li>Your user ID is anonymous and must not be shared publicly.</li>
                </ul>
                <p className="text-gray-600 mb-6">
                    By logging in, you acknowledge and agree to abide by these terms.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Close
                    </button>
                    <button
                        onClick={onAccept}
                        className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TermsModal;
