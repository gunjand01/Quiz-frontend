import toast from 'react-hot-toast';

export default function copyLink(id) {
  const url = new URL(window.location.href);
  url.pathname = '';

  // Get the modified URL
  const modifiedUrl = url.href;
  navigator.clipboard.writeText(`${modifiedUrl}questionAnalysis/${id}`);
  toast.success('URL copied to clipboard');
}

// import toast from 'react-hot-toast';

// export default function copyLink(id) {
//   // Set the base URL to localhost:8000
//   const baseUrl = 'http://localhost:8000';

//   // Construct the full URL
//   const fullUrl = `${baseUrl}/api/v1/quiz/question/${id}`;

//   // Copy the URL to the clipboard
//   navigator.clipboard.writeText(fullUrl);

//   // Show a success toast
//   toast.success('URL copied to clipboard');
// }
