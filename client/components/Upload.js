import axios from 'axios'
import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import {useDropzone} from 'react-dropzone'
import ReactDOM from "react-dom"


export default function Upload () {

    const handleSubmit = async (evt) => {
      evt.preventDefault()
      let formData = new FormData();
      const csvFile = document.querySelector('#uploadSingleFileForm');
      formData.append("file", csvFile.file.files[0]);
      // try {
        await axios.post('/api/donations', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(({data}) => {
          let displayInfo = data.filename + " : " + data.message
          const responseDiv = document.querySelector("#response")
          responseDiv.style = {
            display: 'block', 
          }

          console.log(responseDiv.style.display)
          ReactDOM.render(<div style={{
            backgroundColor: '#e6e6ff',
            border: "solid 1px black",
            borderRadius: "3px",
            margin: "10px",
            padding: "10px"
          }}>
            {displayInfo}
          </div>, responseDiv)
        }).catch((error) => {
          console.log(error)
        })
      
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-7" style={{backgroundColor:"#e6fffa", padding:"10px", borderRadius:"3px"}}>
                    <h3>Upload Donation File</h3>
                    <form id="uploadSingleFileForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="control-label" htmlFor="uploadfile">Choose a File:</label>
                            <input type="file" className="form-control" 
                                    placeholder="Choose a upload file" name="file" required></input>
                        </div>
                        <button type="submit" className="btn btn-danger" id="btnUploadSingleFileSubmit">Submit</button>
                    </form>
                    <div id="response" style={{display:"none"}}></div>
                </div>
            </div>
        </div>
    )
}