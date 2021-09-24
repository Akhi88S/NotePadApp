import React, { useEffect, useState } from "react";
import "./NoteRoots.scss";
import { Pagination } from "react-bootstrap";
const NoteRoot = () => {
  const [active, setActive] = useState(1);
  const [items, setItems] = useState([]);
  const [textData, setTextData] = useState([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState("");
  const textDataStorge =
    JSON.parse(localStorage.getItem("textDataStorge")) || [];

  useEffect(() => {
    //get data from localstorage and update to state
    setTextData(textDataStorge);
    setLastUpdatedAt(getDateFormat(textDataStorge[0]?.lastUpdated));
  }, []);

  useEffect(() => {
    //auto add next page to pagination if more than one letter was added to current note page
    if (!textData[active - 1]?.text[1]) getPaginationData();
  }, [JSON.stringify(textData)]);


  const getDateFormat = (date) => {
    //last updated -format conversion
    if(date){
    let dt = new Date(date);
    return `${dt?.getDate()}-${dt?.getMonth()}-${dt.getFullYear()} :: ${dt.getHours()} : ${dt.getMinutes()} : ${dt.getSeconds()}`;
    }
    else{
      let dt = new Date();
      return `${dt?.getDate()}-${dt?.getMonth()}-${dt.getFullYear()} :: ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`;
     
    }
  };
 
  useEffect(() => {
    //get pagination data if tab changes to new tab/page
    getPaginationData();
  }, [active]);

  const getPaginationData = () => {
    //pagination
    let data = [];
    let pageEnd = textDataStorge ? textDataStorge?.length + 1 : 1;
    for (let page = 1; page <= pageEnd; page++) {
      data.push(
        <Pagination.Item key={page} active={page === active}>
          {page}
        </Pagination.Item>
      );
    }
    setItems(data);
  };
  const pageChangeHandler = (e) => {
    //when page number was clicked
    let pageNumber = +e.target.text;
    setActive(pageNumber);
    setLastUpdatedAt(getDateFormat(textData[pageNumber - 1]?.lastUpdated));
  };
  const textDataHandler = (e) => {
    //update state when text was changed in notepad
    let data = [...textData];
    let value = e.target.value;
    data[active - 1] = {
      text: value,
      lastUpdated: new Date(),
      showTextArea: true,
    };
    setTextData(data);
    localStorage.setItem("textDataStorge", JSON.stringify(data));
  };
  const addText = () => {
    //when add icon clciked, new default sate will be added
    let data = [...textData];
    data[active - 1] = {
      text: "",
      lastUpdated:new Date(),
      showTextArea: true,
    };
    setTextData(data);
  };
  return (
    <div className="rootContainer">
      <div className="notePad_container">
        <div className="align-self-cente no_notes_text">
          {textData[active - 1]?.showTextArea ? (
            <textarea
              className="text_area_styles"
              placeholder="Enter Your Notes"
              value={textData[active - 1]?.text || ""}
              onChange={textDataHandler}
              cols="30"
              rows="3"
            ></textarea>
          ) : (
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={addText}
            >
              <p style={{ fontSize: "22px" }}>No Notes created here Yet, </p>
              <span className="material-icons add_icon">
                add_circle_outline
              </span>
            </div>
          )}
        </div>
        <div>{textData[active - 1]?.showTextArea&&textData[active - 1]?.lastUpdated&&lastUpdatedAt &&
         <p>{textData[active - 1]?.text?'Last Updated At: ':'Created At: '}{lastUpdatedAt}</p>}</div>
        <div className="align-self-center">
          <Pagination onClick={pageChangeHandler}>{items}</Pagination>
        </div>
      </div>
    </div>
  );
};
export default React.memo(NoteRoot);
