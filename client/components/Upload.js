

export default function Upload () {
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-7" style="background-color:#e6fffa; padding:10px; border-radius:3px">
                    <h3>Upload Single File</h3>
                    <form id="uploadSingleFileForm">
                        <div className="form-group">
                            <label className="control-label" for="uploadfile">Choose a File:</label>
                            <input type="file" className="form-control" 
                                    placeholder="Choose a upload file" name="file" required></input>
                        </div>
                        <button type="submit" className="btn btn-danger" id="btnUploadSingleFileSubmit">Submit</button>
                    </form>
                    <div id="response" style="display:none">
                    </div>
                </div>
            </div>
            <hr>		
            <div className="row">
                <div className="col-sm-7" style="background-color:#e6fffa; padding:10px; border-radius:3px">
                    <h3>Upload Multiple Files</h3>
                    <form id="uploadMultipleFilesForm">
                        <div className="form-group">
                            <label className="control-label" for="uploadfiles">Choose Files:</label>
                            <input type="file" className="form-control" 
                                    placeholder="Choose upload files" name="files" multiple required></input>
                        </div>
                        <button type="submit" className="btn btn-danger" id="btnUploadMultipleFilesSubmit">Submit</button>
                    </form>
                    <div id="responses" style="display:none">
                    </div>
                </div>
                
            </div>
            <hr>
            <div id="downloadfiles" className="row">
                <div className="col-sm-7">
                    <a href="/api/file" className="btn btn-info" role="button">Download CSV File</a>
                </div>
            </div>
        </div>
    )
}