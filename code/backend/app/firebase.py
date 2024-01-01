import firebase_admin
from firebase_admin import credentials,db
import os 
current_script_directory = os.path.dirname(os.path.abspath(__file__))

# Path to your service account key JSON file
service_account_key_path = os.path.join(current_script_directory, "../firebaseKey/spubase-83c34-firebase-adminsdk-gamdx-5a31fb906f.json")

config = {
  "apiKey": "AIzaSyAIImng2hSmqhYLRNz0qYQwIRyKYO-UfOg",
  "authDomain": "spubase-83c34.firebaseapp.com",
  "databaseURL": "https://spubase-83c34-default-rtdb.firebaseio.com",
  "projectId": "spubase-83c34",
  "storageBucket": "spubase-83c34.appspot.com",
  "messagingSenderId": "900246392280",
  "appId": "1:900246392280:web:865c7a74ce61e64b6ff6ad",
}
cred = credentials.Certificate(service_account_key_path)
firebase_admin.initialize_app(cred, options={
    'databaseURL': config['databaseURL']
})

def getData(reference):
    data=db.reference(reference)
    all_data=data.get()
    if not all_data:
        all_data={}
        
    return all_data
    
def postData(reference,data):
        ref=db.reference(reference)
        # Use push() to generate a unique key for the new suggestion
        new_project_key = ref.push().key
        # Save the data to Firebase using the unique key
        ref.child(new_project_key).set(data)
        return data
      
      
def deleteData(reference,key):
    ref=db.reference(reference)
    if ref.child(key).get():
      ref.child(key).delete()
      return 'delete {key} from {reference} success'
    else :
      return '{key} not found in {reference}'
    
def getSingleRow(reference,key):
    ref=db.reference(reference)
    return ref.child(key).get()


def getNotification(reference, id):
    ref = db.reference(reference)
    all_data = ref.get()

    if all_data is None:
        return {}  # Return an empty dictionary if there's no data

    # Filter data where 'receiver_id' contains the specified 'id'
    filtered_data = {
        key: value for key, value in all_data.items() if value.get('receiver_id') == id
    }

    return filtered_data
  
def getDataByID(refefence,field,id):
    ref=db.reference(refefence)
    try:
        all_data = ref.get()
        if all_data is None:
            return {}
        
        filtered_data = {
            key: value for key, value in all_data.items() if value.get(field) == id
        }
        return filtered_data
    except Exception as e:
        return {}
  
def editDataByID(reference,id,newData):
  ref=db.reference(reference)
  data=ref.child(id).update(newData)
  return data
  
def Logging(data):
        ref=db.reference('Logging')
        # Use push() to generate a unique key 
        new_project_key = ref.push().key
        # Save the data to Firebase using the unique key
        ref.child(new_project_key).set(data)
        return data
      
def addStudentRequest(reference,data):
    ref = db.reference(reference)
    new_project_key = ref.push().key
    ref.child(new_project_key).set(data)
    return data
  
def get_user_projects(reference, user_id):
    data = db.reference(reference).get()

    user_projects = {}
    if data :
      for project_id, project_data in data.items():
          students_data = project_data.get("students", {})
          if str(user_id) in students_data:
            user_projects[project_id] = project_data
                
    return user_projects

def get_student_projects(reference,reference2, user_id):
    data = db.reference(reference).get()
    data2 = db.reference(reference2).get()

    user_projects = {}
    if data :
      for project_id, project_data in data.items():
          students_data = project_data.get("students", {})
          if str(user_id) in students_data:
            user_projects[project_id] = project_data
    if data2 :
      for project_id, project_data in data2.items():
          students_data = project_data.get("students", {})
          if str(user_id) in students_data:
            user_projects[project_id] = project_data
                
    return user_projects
  
def check_if_apply_projects(reference, user_id):
    data = db.reference(reference).get()
    if data:
        for project_id, project_data in data.items():
            students_data = project_data.get("students", {})

            if str(user_id) in students_data:
                return True

    return False

def get_supervisor_projects(reference, user_id):
    data = db.reference(reference).get()

    user_projects = {}
    if data :
      for project_id, project_data in data.items():
          supervisor = project_data.get('supervisor_id')
          if supervisor ==user_id :
            user_projects[project_id] = project_data
                
    return user_projects

def get_supervisor_projects2(reference,reference2, user_id):
    data = db.reference(reference).get()
    data2 = db.reference(reference2).get()

    user_projects = {}
    if data :
      for project_id, project_data in data.items():
          supervisor = project_data.get('supervisor_id')
          if supervisor ==user_id :
            user_projects[project_id] = project_data
    if data2 :
      for project_id, project_data in data2.items():
          supervisor = project_data.get('supervisor_id')
          if supervisor ==user_id :
            user_projects[project_id] = project_data
                
    return user_projects

def deleteNotification(user):
    ref = db.reference('notifications')
    data = ref.get()
    for key, value in data.items():
        if value['receiver_id'] == user:
            ref.child(key).delete()
