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

def getData(collection_name):
    data=db.reference(collection_name)
    return data.get()
    
def postData(collection_name,data):
        ref=db.reference(collection_name)
        # Use push() to generate a unique key for the new suggestion
        new_project_key = ref.push().key
        # Save the data to Firebase using the unique key
        ref.child(new_project_key).set(data)
        return data
def deleteData(collection_name,key):
    ref=db.reference(collection_name)
    if ref.child(key).get():
      ref.child(key).delete()
      return 'delete {key} from {collection_name} success'
    else :
      return '{key} not found in {collection_name}'
def getSingleRow(collection_name,key):
  ref=db.reference(collection_name)
  return ref.child(key).get()
