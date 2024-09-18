

let meetingDialoq=`<dialog id="dialogbox">
        <h4>Meeting Information</h4>
        <form action="" id="meetingForm">
            <input type="text" value="New Meeting*" class="meetInp" id="topic">
            <br>
            <input type="text" name="location" id="location" placeholder="location" class="meetInp">
            <br>
            <label for="startTime">From</label><br>
            <input type="datetime-local" name="time" id="startTime" class="meetInp">
            <br>
            <label for="presenterId">PresenterId</label>
            <input type="number" name="presenterId" id="presenterId" class="meetInp" value="60030981356" readonly>
            <br>
            <label for="agenda">Agenda Of Meeting</label>
            <input type="text" name="agenda" id="agenda" class="meetInp">
            <br>
            <label for="participants">Participants</label><br>
            <input type="email" name="participantsMail" id="participants" class="meetInp">
            <br><br>
            <button id="meetingCancelBtn" class="meetBtn">Cancel</button> <button id="meetingSaveBtn" class="meetBtn">Save</button>
        </form>
      </dialog>`;
      