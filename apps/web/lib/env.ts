const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  console.warn(
    "NEXT_PUBLIC_API_URL is not defined. API requests will fail until it is set."
  );
}

export const environment = {
  apiUrl: apiUrl ?? ""
};

