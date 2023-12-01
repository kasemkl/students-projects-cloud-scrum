def validateRequestsData(data):
    required_fields = ['title', 'description', 'goal', 'department', 'supervisor_id', 'supervisor_name']

    # Check if all required fields are present in the data dictionary
    missing_fields = [field for field in required_fields if field not in data]

    # Check if any of the required fields have an empty string value
    empty_fields = [field for field in required_fields if field in data and not data[field]]

    if not missing_fields and not empty_fields:
        # All required fields are present and none of them have an empty string value
        return True
    else:
        # Some required fields are missing or have an empty string value
        return False
