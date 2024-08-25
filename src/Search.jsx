import React, { useState } from "react";
import axios from "axios";

const Search = () => {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!word.trim()) {
      // Check if the input is empty or just spaces
      setError("Please enter a word in the search box.");
      setDefinition(null);
      setAudioUrl(null);
      return;
    }

    setError(null); // Clear any previous error messages

    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const definition =
        response.data[0]?.meanings[0]?.definitions[0]?.definition;
      const phonetics = response.data[0]?.phonetics;
      const audio = phonetics?.find((p) => p.audio); // Find the first phonetic with an audio URL

      if (definition) {
        setDefinition(definition);
        setAudioUrl(audio ? audio.audio : null); // Set audio URL if available
      } else {
        setError("Sorry, No Data Found");
        setDefinition(null);
        setAudioUrl(null);
      }
    } catch (error) {
      console.error("Error fetching the definition", error);
      setError("Sorry, No Data Found");
      setDefinition(null);
      setAudioUrl(null);
    }
  };

  const handleClear = () => {
    setWord("");
    setDefinition(null);
    setAudioUrl(null);
    setError(null); // Clear the error message when clearing the input
  };

  return (
    <React.Fragment>
      <div style={{ margin: "20px" }}>
        <h1>Dictionary App</h1>
        <input
          type="text"
          placeholder="Enter a word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <div style={{ margin: "20px" }}>
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
          <button
            className="btn btn-danger"
            onClick={handleClear}
            style={{ marginLeft: "10px" }}
          >
            Clear
          </button>
          {error && (
            <div style={{ marginTop: "20px", color: "red" }}>
              <p>{error}</p>
            </div>
          )}
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                {definition && (
                  <div style={{ marginTop: "20px" }}>
                    <span style={{ color: "green" }}>Answer: </span>
                    <span>{definition}</span>
                    {audioUrl && (
                      <div style={{ marginTop: "10px" }}>
                        <h4>Pronunciation:</h4>
                        <audio controls>
                          <source src={audioUrl} type="audio/mp3" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Search;
