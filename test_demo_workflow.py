import urllib.request
import urllib.parse
import json
import http.cookiejar
import sys
import time

BASE_URL = "http://127.0.0.1:8000/api"
FRONTEND_URL = "http://localhost:5173"

def main():
    print("=" * 60)
    print("END-TO-END DEMO VERIFICATION: STUDENT & ADMIN WORKFLOW")
    print("=" * 60)

    # Cookie jar to maintain session
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

    # 1. Verify Frontend
    print("\n[Step 1] Checking Frontend availability...")
    try:
        req = urllib.request.Request(FRONTEND_URL)
        with urllib.request.urlopen(req) as resp:
            print(f"  --> Frontend is LIVE at {FRONTEND_URL} (Status: {resp.status})")
    except Exception as e:
        print(f"  --> Error connecting to frontend: {e}")
        return 1

    # 2. Verify Backend
    print("\n[Step 2] Checking Backend API...")
    try:
        req = urllib.request.Request(f"{BASE_URL}/courses/")
        with urllib.request.urlopen(req) as resp:
            courses = json.loads(resp.read().decode())
            print(f"  --> Backend is LIVE at {BASE_URL} (Courses count: {len(courses)})")
    except Exception as e:
        print(f"  --> Error connecting to backend: {e}")
        return 1

    # 3. Student creates a subject (Course) with unique code
    suffix = str(int(time.time()))[-4:]
    course_name = f"Cloud DevOps & SRE {suffix}"
    course_code = f"CLOUD{suffix}"
    print(f"\n[Step 3] Student creates a new Subject/Course ('{course_name}')...")
    course_data = json.dumps({
        "name": course_name,
        "code": course_code,
        "description": "Kubernetes, Docker, CI/CD pipelines, and cloud architecture.",
        "icon": "cpu",
        "color": "#0284c7"
    }).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/courses/", data=course_data, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        course = json.loads(resp.read().decode())
        course_id = course["id"]
        print(f"  --> Subject Created: ID={course_id}, Name='{course['name']}', Code='{course['code']}'")

    # 4. Student uploads a "Bad/Spam" Study Note
    print("\n[Step 4] Student uploads a concept note (simulating bad/inappropriate data)...")
    bad_material_payload = json.dumps({
        "course": course_id,
        "title": "Spam Note from Student (Random Junk Content)",
        "description": "Inappropriate or low quality material that must be moderated.",
        "content": "This is completely wrong and not useful for placement preparation. #SPAM",
    }).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/materials/", data=bad_material_payload, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        bad_mat = json.loads(resp.read().decode())
        bad_mat_id = bad_mat["id"]
        print(f"  --> Bad Material Uploaded: ID={bad_mat_id}, Title='{bad_mat['title']}'")
        print(f"  --> Generated PDF URL: {bad_mat.get('pdf_file')}")

    # 5. Admin Login
    print("\n[Step 5] Super Admin logs into the portal...")
    login_payload = json.dumps({
        "username": "admin",
        "password": "admin123"
    }).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/auth/login/", data=login_payload, headers={'Content-Type': 'application/json'}, method='POST')
    with opener.open(req) as resp:
        login_res = json.loads(resp.read().decode())
        u = login_res.get('user', {})
        print(f"  --> Admin Login Successful! User: {u.get('username')}, is_superuser: {u.get('is_superuser')}")

    # 6. Admin adds a Placement Quiz question for this subject
    print("\n[Step 6] Super Admin adds a Placement Quiz question into the new subject...")
    question_payload = json.dumps({
        "course": course_id,
        "question": "Which open-source system is primarily used for automating the deployment, scaling, and management of containerized applications?",
        "option_a": "Kubernetes (K8s)",
        "option_b": "Apache Cassandra",
        "option_c": "SQLite",
        "option_d": "RabbitMQ",
        "correct_option": "A",
        "difficulty": "Easy",
        "explanation": "Kubernetes is an open-source container orchestration platform designed to automate deploying, scaling, and operating application containers."
    }).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/questions/", data=question_payload, headers={'Content-Type': 'application/json'}, method='POST')
    with opener.open(req) as resp:
        quiz_q = json.loads(resp.read().decode())
        quiz_q_id = quiz_q["id"]
        print(f"  --> Quiz Question Created: ID={quiz_q_id}")
        print(f"      Question: {quiz_q['question'][:70]}...")
        print(f"      Correct Option: {quiz_q['correct_option']} - {quiz_q['option_a']}")

    # 7. Admin Moderation: Admin reviews and removes the bad student upload
    print(f"\n[Step 7] Super Admin removes bad student data (Material ID: {bad_mat_id})...")
    req = urllib.request.Request(f"{BASE_URL}/materials/{bad_mat_id}/", method='DELETE')
    with opener.open(req) as resp:
        print(f"  --> Delete Material Request executed! Status: {resp.status}")

    # Verify material is indeed deleted (404)
    print("\n[Step 8] Verifying bad material is removed from system...")
    req = urllib.request.Request(f"{BASE_URL}/materials/{bad_mat_id}/")
    try:
        with urllib.request.urlopen(req) as resp:
            print("  --> [FAIL] Material still exists!")
            return 1
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"  --> [SUCCESS] Bad material successfully deleted! (HTTP {e.code} Not Found)")
        else:
            print(f"  --> Unexpected HTTP code: {e.code}")

    # 8. Verify the Quiz question remains intact for students to practice
    print("\n[Step 9] Verifying Quiz question is live for students...")
    req = urllib.request.Request(f"{BASE_URL}/questions/?course={course_id}")
    with urllib.request.urlopen(req) as resp:
        questions = json.loads(resp.read().decode())
        found_q = [q for q in questions if q["id"] == quiz_q_id]
        if found_q:
            print(f"  --> [SUCCESS] Quiz Question ID {quiz_q_id} is active and ready for students!")
        else:
            print("  --> [FAIL] Quiz question not found!")
            return 1

    # 9. Student takes the Quiz and submits results
    print("\n[Step 10] Student attends test and submits quiz answer...")
    test_submit_payload = json.dumps({
        "student_name": "Demo Candidate",
        "course": course_id,
        "score": 1,
        "total_questions": 1,
        "answers_data": [
            {
                "question_id": quiz_q_id,
                "selected_option": "A",
                "correct_option": "A",
                "is_correct": True
            }
        ]
    }).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/test-results/", data=test_submit_payload, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        test_res = json.loads(resp.read().decode())
        print(f"  --> Student Test Result Received! ID: {test_res.get('id')}")
        print(f"      Candidate: {test_res.get('student_name')}")
        print(f"      Score: {test_res.get('score')}/{test_res.get('total_questions')}")
        print(f"      Percentage: {test_res.get('percentage')}%")
        print(f"      Passed: {test_res.get('passed')}")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY! FULL DEMO WORKFLOW VERIFIED.")
    print("=" * 60)
    return 0

if __name__ == '__main__':
    sys.exit(main())
