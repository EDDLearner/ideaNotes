let mongoURI;
if(process.env.NODE_ENV === "production") {
    mongoURI = "mongodb://localhost/note-prod";
} else {
    mongoURI = "mongodb://localhost:27017/note-dev";
}

export default mongoURI;