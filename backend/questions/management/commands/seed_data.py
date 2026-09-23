from django.core.management.base import BaseCommand
from questions.models import Course, Topic, Question, StudyMaterial, TestResult

COURSES_DATA = [
    {
        "name": "C Programming",
        "code": "C",
        "description": "Master procedural programming, pointers, low-level memory allocation, structures, and bitwise operations for top technical placements.",
        "icon": "Terminal",
        "color": "#38bdf8",
        "topics": [
            {
                "name": "Pointers & Memory Allocation",
                "description": "Pointer arithmetic, dynamic allocation (malloc, calloc, realloc, free), dangling and wild pointers.",
                "notes": """# C Pointers & Memory Allocation Mastery
Course: C Programming | Topic: Pointers & Memory Allocation

## 1. What is a Pointer?
• A pointer is a variable that holds the memory address of another variable.
• Address-of operator (&): Returns the physical memory address of variable.
• Dereference operator (*): Accesses the value stored at the referenced address.
• Pointer arithmetic: ptr + 1 advances the address by sizeof(dataType) bytes.

## 2. Dynamic Memory Management (stdlib.h)
• malloc(size): Allocates raw heap memory; contains garbage values.
• calloc(n, size): Allocates zero-initialized contiguous memory for n elements.
• realloc(ptr, new_size): Resizes previous allocation while preserving existing data.
• free(ptr): Deallocates memory to prevent memory leaks.

## 3. Dangerous Pointer Traps
• Dangling pointer: Points to freed/deallocated memory. Always set ptr = NULL after free(ptr).
• Wild pointer: Uninitialized pointer containing random memory address.
• Memory leak: Heap memory allocated but never freed when pointer goes out of scope."""
            },
            {
                "name": "Storage Classes & Scope",
                "description": "auto, static, extern, and register storage specifiers with lifetimes and linkage.",
                "notes": """# C Storage Classes & Variable Lifetimes
Course: C Programming | Topic: Storage Classes & Scope

## 1. The Four Storage Classes
• auto: Default for local variables. Allocated on stack, destroyed upon function exit.
• static: Retains value between function invocations. Initialized once in data segment (default 0).
• extern: Declares a global variable defined in another file/translation unit.
• register: Requests compiler to store variable in CPU register for ultra-fast access.

## 2. Scope & Linkage Rules
• Block scope: Variables declared inside curly braces {}.
• File scope: Variables declared outside all functions.
• static global variables have internal linkage (invisible to other translation units)."""
            },
            {
                "name": "Structures, Unions & Padding",
                "description": "Memory alignment, padding rules, bit fields, and differences between structs and unions.",
                "notes": """# C Structures, Padding & Unions
Course: C Programming | Topic: Structures, Unions & Padding

## 1. Memory Alignment & Structure Padding
• CPUs access memory in natural word-sized boundaries (4 or 8 bytes).
• Compilers inject unused padding bytes between struct members to align each type naturally.
• To minimize struct size, order fields from largest to smallest.

## 2. Structures vs Unions
• struct: Each member has its own separate memory location. Total size >= sum of member sizes.
• union: All members share the exact same starting memory address. Total size = size of largest member (rounded to alignment)."""
            },
            {
                "name": "Bitwise Operators & Function Pointers",
                "description": "Bit manipulations, shift operators, masking, and callbacks using function pointers.",
                "notes": """# C Bitwise Operations & Function Pointers
Course: C Programming | Topic: Bitwise Operators & Function Pointers

## 1. Bitwise Manipulation
• Left shift (<<): Multiplies integer by 2^n (e.g. 5 << 2 = 20).
• Right shift (>>): Divides integer by 2^n.
• Bitwise AND (&): Used for clearing/masking bits and checking even/odd (n & 1).
• Bitwise OR (|): Used for setting specific bits.
• Bitwise XOR (^): Used for toggling bits and finding unique elements (a ^ a = 0).

## 2. Function Pointers
• Syntax: return_type (*func_ptr_name)(param_types);
• Enables passing functions as callback arguments to generic routines (like qsort())."""
            }
        ]
    },
    {
        "name": "C++ & OOP",
        "code": "CPP",
        "description": "Object-oriented principles, virtual tables, constructors, destructors, smart pointers, and STL algorithms.",
        "icon": "Cpu",
        "color": "#818cf8",
        "topics": [
            {
                "name": "OOP & Virtual Functions",
                "description": "Polymorphism, vtables, vptrs, pure virtual functions, and abstract base classes.",
                "notes": """# C++ OOP & Virtual Functions Guide
Course: C++ & OOP | Topic: OOP & Virtual Functions

## 1. Four Pillars of OOP in C++
• Encapsulation: Bundling data and methods into classes with private/protected/public access.
• Abstraction: Exposing essential interface via abstract classes with pure virtual functions (virtual void f() = 0;).
• Inheritance: Deriving classes to reuse and extend functionality.
• Polymorphism: Compile-time (overloading) vs Runtime (virtual functions).

## 2. Virtual Function Internals (vtable & vptr)
• Any class declaring virtual functions receives an invisible compiler-generated pointer: vptr.
• vptr points to a per-class vtable (array of function pointers).
• Calling a virtual function dereferences vptr at runtime to invoke the actual derived override."""
            },
            {
                "name": "Constructors, Destructors & RAII",
                "description": "Copy/move constructors, virtual destructors, resource lifecycle, and memory safety.",
                "notes": """# C++ Constructors, Destructors & RAII
Course: C++ & OOP | Topic: Constructors, Destructors & RAII

## 1. Virtual Destructors Rule
• If a base class has any virtual functions, its destructor MUST be declared virtual.
• If deleted via a base pointer without a virtual destructor, only the base destructor executes, leaving derived resources leaked!

## 2. RAII (Resource Acquisition Is Initialization)
• Tie resource lifetime to object lifetime. Acquire in constructor, free in destructor.
• Prevents resource leaks in the presence of exceptions."""
            },
            {
                "name": "Multiple Inheritance & Diamond Problem",
                "description": "Ambiguity in multiple inheritance trees and resolution using virtual inheritance.",
                "notes": """# Multiple Inheritance & The Diamond Problem
Course: C++ & OOP | Topic: Multiple Inheritance & Diamond Problem

## 1. The Diamond Hierarchy
• Occurs when class D inherits from B and C, both of which inherit from common ancestor A.
• Without intervention, D receives two duplicate copies of A's members, causing ambiguity errors.

## 2. Virtual Inheritance Solution
• Declare inheritance as: class B : virtual public A and class C : virtual public A.
• Ensures only one shared instance of A's subobject exists in D."""
            },
            {
                "name": "Templates & STL Containers",
                "description": "Vectors, maps, sets, unordered_map complexity, iterators, and smart pointers.",
                "notes": """# C++ Standard Template Library (STL)
Course: C++ & OOP | Topic: Templates & STL Containers

## 1. STL Containers
• std::vector: Dynamic contiguous array, O(1) random access, amortized O(1) push_back.
• std::map: Balanced Red-Black BST, sorted keys, O(log n) search/insert.
• std::unordered_map: Hash table, O(1) average lookup, O(n) worst-case on collisions.

## 2. Modern Smart Pointers
• std::unique_ptr: Exclusive ownership, non-copyable, zero overhead.
• std::shared_ptr: Shared ownership via reference counting.
• std::weak_ptr: Non-owning observer that breaks cyclic shared_ptr references."""
            }
        ]
    },
    {
        "name": "Java Core",
        "code": "JAVA",
        "description": "JVM architecture, Garbage Collection, String Pool, Multithreading, Exception Hierarchy, and Collections Framework.",
        "icon": "Coffee",
        "color": "#fb923c",
        "topics": [
            {
                "name": "JVM Architecture & Memory Areas",
                "description": "Classloader subsystem, Method Area, Heap, Stack frames, and Generational Garbage Collection.",
                "notes": """# Java JVM Architecture & Memory Model
Course: Java Core | Topic: JVM Architecture & Memory Areas

## 1. JVM Memory Segments
• Method Area: Stores class metadata, bytecode, static variables, and runtime constant pool.
• Heap Area: Stores all object instances and arrays. Shared across all threads.
• JVM Stack Area: Each thread has its own stack containing frames for active method calls.
• PC Registers & Native Method Stacks: Track bytecode execution and native C/C++ libraries.

## 2. Generational Garbage Collection
• Young Generation: Eden space + 2 Survivor spaces (S0, S1). Most objects die young (Minor GC).
• Old / Tenured Generation: Objects that survive multiple GC cycles migrate here (Major / Full GC)."""
            },
            {
                "name": "Strings, Immutability & String Pool",
                "description": "String constant pool, equality checks (== vs equals), StringBuilder vs StringBuffer.",
                "notes": """# Java Strings & Memory Immutability
Course: Java Core | Topic: Strings, Immutability & String Pool

## 1. Why Strings are Immutable
• Security: Sensitive values (passwords, network sockets, DB credentials) cannot be mutated.
• Caching: String Constant Pool saves massive heap memory by sharing identical literal instances.
• Thread-Safety: Immutable objects can be freely shared across threads without synchronization.

## 2. Comparison: == vs .equals()
• '==' checks reference equality (do both variables point to identical memory address?).
• '.equals()' checks logical content equality (character sequence match)."""
            },
            {
                "name": "Collections Framework & HashMaps",
                "description": "List, Set, Map hierarchies, HashMap internal hashing, collision resolution, and hashCode contract.",
                "notes": """# Java Collections Framework & HashMap Internals
Course: Java Core | Topic: Collections Framework & HashMaps

## 1. HashMap Internals
• Array of Node<K,V> buckets. Uses hash(key.hashCode()) to find bucket index.
• Collisions resolved via singly-linked lists.
• In Java 8+, if bucket size exceeds TREEIFY_THRESHOLD (8), list converts to Red-Black Tree (O(log n) search).

## 2. HashMap vs Hashtable
• HashMap: Non-synchronized (fast), allows 1 null key and multiple null values.
• Hashtable: Legacy, synchronized (slower), throws NullPointerException on null keys/values."""
            },
            {
                "name": "Multithreading, Concurrency & Exceptions",
                "description": "Thread lifecycle, synchronization, volatile keyword, and Checked vs Unchecked exceptions.",
                "notes": """# Java Concurrency & Exception Handling
Course: Java Core | Topic: Multithreading, Concurrency & Exceptions

## 1. Exception Hierarchy
• Throwable is root. Divided into Error (system failures, unchecked) and Exception.
• RuntimeException: Unchecked (NullPointerException, ArrayIndexOutOfBoundsException).
• Checked Exceptions: Must be caught or declared with 'throws' (IOException, SQLException).

## 2. Thread Lifecycle States
• NEW -> RUNNABLE -> BLOCKED / WAITING / TIMED_WAITING -> TERMINATED.
• volatile keyword: Guarantees visibility of variable updates across CPU caches directly to main memory."""
            }
        ]
    },
    {
        "name": "Unix & Linux",
        "code": "UNIX",
        "description": "Operating system internals, processes, signals, file systems, inodes, permissions, piping, and shell utilities.",
        "icon": "TerminalSquare",
        "color": "#34d399",
        "topics": [
            {
                "name": "Process Life Cycle (fork, exec, zombie)",
                "description": "Process creation via fork(), image overlay with exec(), zombies, and orphans.",
                "notes": """# Unix Process Management & Life Cycle
Course: Unix & Linux | Topic: Process Life Cycle (fork, exec, zombie)

## 1. Process Creation
• fork(): Duplicates calling process (child receives return 0; parent receives child's PID).
• exec(): Overlays the address space of current process with a new binary executable image.

## 2. Special Process States
• Zombie process: Terminated child whose exit code has not yet been read by parent via wait().
• Orphan process: Process whose parent terminated before it; adopted by init (PID 1) or systemd."""
            },
            {
                "name": "File System, Inodes & Links",
                "description": "Inode data structures, metadata, hard links vs soft (symbolic) links.",
                "notes": """# Unix File System, Inodes & Links
Course: Unix & Linux | Topic: File System, Inodes & Links

## 1. What is an Inode?
• Data structure storing file metadata: permissions, owner, file size, timestamps, data block pointers.
• Crucial note: The inode does NOT contain the file's name! Directory entries map names to inode numbers.

## 2. Hard Link vs Soft Link
• Hard Link: Points directly to original file's inode number. Deleting one link preserves data.
• Soft Link (Symlink): Separate file containing path string to the target file."""
            },
            {
                "name": "File Permissions (chmod, umask)",
                "description": "Octal permissions calculation, owner/group/other triplets, and default umask masks.",
                "notes": """# Unix File Permissions & Access Modes
Course: Unix & Linux | Topic: File Permissions (chmod, umask)

## 1. Permission Octal Calculation
• Read (r) = 4, Write (w) = 2, Execute (x) = 1.
• Triplet ordering: [Owner][Group][Others].
• Example: rwxr-xr-- = (4+2+1)(4+0+1)(4+0+0) = 754.

## 2. Umask Masking
• Default permission mask subtracted from 666 (for files) or 777 (for directories)."""
            },
            {
                "name": "Signals, Pipes & Command Utilities",
                "description": "Process signals (SIGKILL, SIGTERM), redirection, grep, sed, awk, find, and top.",
                "notes": """# Unix Signals, Pipes & CLI Utilities
Course: Unix & Linux | Topic: Signals, Pipes & Command Utilities

## 1. Critical Unix Signals
• SIGKILL (9): Kills process immediately; CANNOT be caught, blocked, or ignored.
• SIGTERM (15): Polite termination request; process can catch signal and clean up resources.

## 2. Piping & Stream Redirection
• Pipe (|): Passes stdout of left command directly into stdin of right command.
• Top Utilities: grep (regex search), sed (stream editor), awk (column pattern processing), find (directory search)."""
            }
        ]
    }
]

QUESTIONS_DATA = [
    # C Questions
    {
        "course": "C", "topic": "Pointers & Memory Allocation",
        "question": "What is the output of the following C code snippet?\n\n#include <stdio.h>\nint main() {\n    int a = 10;\n    int *ptr = &a;\n    *ptr = *ptr * 2;\n    printf(\"%d\", a);\n    return 0;\n}",
        "difficulty": "Easy", "option_a": "10", "option_b": "20", "option_c": "Garbage value", "option_d": "Compilation error",
        "correct_option": "B", "explanation": "*ptr dereferences the memory address of variable a. Multiplying *ptr by 2 directly modifies a to 20."
    },
    {
        "course": "C", "topic": "Pointers & Memory Allocation",
        "question": "Which standard library function allocates dynamic memory and initializes all bytes to zero?",
        "difficulty": "Easy", "option_a": "malloc()", "option_b": "calloc()", "option_c": "realloc()", "option_d": "alloc()",
        "correct_option": "B", "explanation": "calloc(n, size) allocates memory and zero-initializes every byte, whereas malloc leaves memory uninitialized."
    },
    {
        "course": "C", "topic": "Pointers & Memory Allocation",
        "question": "What is a 'dangling pointer' in C?",
        "difficulty": "Medium", "option_a": "A pointer initialized to NULL", "option_b": "A pointer pointing to deallocated/freed memory", "option_c": "A pointer with no address assigned", "option_d": "A read-only pointer",
        "correct_option": "B", "explanation": "A dangling pointer points to a memory location that has been deallocated with free()."
    },
    {
        "course": "C", "topic": "Storage Classes & Scope",
        "question": "What is the default storage class for local variables declared inside a C function?",
        "difficulty": "Easy", "option_a": "auto", "option_b": "static", "option_c": "extern", "option_d": "register",
        "correct_option": "A", "explanation": "Local variables inside any block default to the 'auto' storage class."
    },
    {
        "course": "C", "topic": "Structures, Unions & Padding",
        "question": "What causes structure padding in C?",
        "difficulty": "Hard", "option_a": "Hardware memory bus alignment constraints", "option_b": "Dynamic dispatch overhead", "option_c": "Garbage collection flags", "option_d": "Linker symbol tables",
        "correct_option": "A", "explanation": "Compilers insert padding bytes between struct members to align multi-byte types to natural word boundaries for fast CPU memory access."
    },
    {
        "course": "C", "topic": "Bitwise Operators & Function Pointers",
        "question": "What is the result of evaluating the expression (5 << 2) in C?",
        "difficulty": "Medium", "option_a": "10", "option_b": "20", "option_c": "25", "option_d": "2",
        "correct_option": "B", "explanation": "Bitwise left shift (<<) shifts bits by 2 positions: 5 * 2^2 = 5 * 4 = 20."
    },

    # C++ Questions
    {
        "course": "CPP", "topic": "OOP & Virtual Functions",
        "question": "Which mechanism enables runtime polymorphism in C++?",
        "difficulty": "Easy", "option_a": "Function overloading", "option_b": "Virtual functions", "option_c": "Templates", "option_d": "Friend functions",
        "correct_option": "B", "explanation": "Virtual functions enable dynamic binding at runtime using the vtable and vptr mechanism."
    },
    {
        "course": "CPP", "topic": "Constructors, Destructors & RAII",
        "question": "Why should a base class destructor always be declared virtual in C++?",
        "difficulty": "Medium", "option_a": "To allow private inheritance", "option_b": "To ensure derived class destructors are called when deleted via a base pointer", "option_c": "To prevent instantiation of the base class", "option_d": "To speed up compilation",
        "correct_option": "B", "explanation": "If a base destructor is not virtual, calling delete on a base pointer invokes only the base destructor, leaking derived resources."
    },
    {
        "course": "CPP", "topic": "Multiple Inheritance & Diamond Problem",
        "question": "How is the Diamond Problem resolved in C++ multiple inheritance?",
        "difficulty": "Medium", "option_a": "Using Virtual Inheritance (virtual keyword in base list)", "option_b": "Using private inheritance", "option_c": "Using static casts", "option_d": "Using friend classes",
        "correct_option": "A", "explanation": "Virtual inheritance ensures only one copy of the common ancestor subobject is included in the most derived class."
    },
    {
        "course": "CPP", "topic": "Templates & STL Containers",
        "question": "What is the worst-case search complexity of std::unordered_map in C++?",
        "difficulty": "Medium", "option_a": "O(1)", "option_b": "O(log n)", "option_c": "O(n)", "option_d": "O(n log n)",
        "correct_option": "C", "explanation": "While average search is O(1), catastrophic hash collisions on all elements degrade performance to O(n)."
    },

    # Java Questions
    {
        "course": "JAVA", "topic": "Strings, Immutability & String Pool",
        "question": "Why are String objects immutable in Java?",
        "difficulty": "Easy", "option_a": "String Pool caching, security, and thread-safety", "option_b": "Java lacks a garbage collector for strings", "option_c": "Strings are primitive data types", "option_d": "To prevent inheritance from Object",
        "correct_option": "A", "explanation": "Immutability allows String Constant Pool caching, guarantees thread-safety, and protects sensitive network and database parameters."
    },
    {
        "course": "JAVA", "topic": "Strings, Immutability & String Pool",
        "question": "What is the difference between '==' and '.equals()' when comparing objects in Java?",
        "difficulty": "Easy", "option_a": "== compares values; .equals() compares memory addresses", "option_b": "== compares memory addresses; .equals() compares logical content", "option_c": "Both are completely interchangeable", "option_d": "equals() is only for numbers",
        "correct_option": "B", "explanation": "'==' tests reference equality (identical memory address), while .equals() tests logical content equivalence."
    },
    {
        "course": "JAVA", "topic": "Collections Framework & HashMaps",
        "question": "What is the primary difference between HashMap and Hashtable in Java?",
        "difficulty": "Medium", "option_a": "HashMap is unsynchronized and allows 1 null key; Hashtable is synchronized and forbids nulls", "option_b": "Hashtable is faster than HashMap", "option_c": "HashMap does not permit null values", "option_d": "Hashtable is part of Java 8 Streams",
        "correct_option": "A", "explanation": "HashMap is unsynchronized and allows one null key. Hashtable is legacy, synchronized, and throws NullPointerException on null keys."
    },
    {
        "course": "JAVA", "topic": "Multithreading, Concurrency & Exceptions",
        "question": "What happens when an unhandled exception occurs inside a thread in Java?",
        "difficulty": "Medium", "option_a": "The whole JVM terminates immediately", "option_b": "Only that specific thread terminates; other non-daemon threads continue", "option_c": "The thread pauses and restarts from main()", "option_d": "The exception is ignored",
        "correct_option": "B", "explanation": "An unhandled exception terminates only that particular thread. The JVM continues executing any remaining non-daemon threads."
    },

    # Unix Questions
    {
        "course": "UNIX", "topic": "Process Life Cycle (fork, exec, zombie)",
        "question": "What is a 'zombie process' in Unix?",
        "difficulty": "Medium", "option_a": "A process that cannot be killed by root", "option_b": "A terminated child process whose exit status has not been retrieved by parent via wait()", "option_c": "A process whose parent terminated", "option_d": "A process in an infinite loop",
        "correct_option": "B", "explanation": "When a child finishes, its process table entry remains until the parent calls wait() to read its termination exit code."
    },
    {
        "course": "UNIX", "topic": "File Permissions (chmod, umask)",
        "question": "What numerical octal permission represents 'rwxr-xr--' in Unix?",
        "difficulty": "Easy", "option_a": "754", "option_b": "764", "option_c": "654", "option_d": "755",
        "correct_option": "A", "explanation": "rwx = 4+2+1 = 7, r-x = 4+0+1 = 5, r-- = 4+0+0 = 4. Combined: 754."
    },
    {
        "course": "UNIX", "topic": "Signals, Pipes & Command Utilities",
        "question": "Which signal CANNOT be caught, blocked, or ignored in Unix?",
        "difficulty": "Medium", "option_a": "SIGINT", "option_b": "SIGTERM", "option_c": "SIGKILL", "option_d": "SIGHUP",
        "correct_option": "C", "explanation": "SIGKILL (signal 9) and SIGSTOP (signal 19) cannot be caught, blocked, or ignored; the kernel terminates the process immediately."
    }
]

class Command(BaseCommand):
    help = 'Seeds dynamic Courses, Topics, Questions, and Study Materials'

    def handle(self, *args, **options):
        self.stdout.write("Seeding courses, topics, questions, and notes...")

        course_map = {}
        topic_map = {}

        # 1. Create Courses and Topics
        for c_data in COURSES_DATA:
            course, _ = Course.objects.get_or_create(
                code=c_data["code"],
                defaults={
                    "name": c_data["name"],
                    "description": c_data["description"],
                    "icon": c_data["icon"],
                    "color": c_data["color"],
                }
            )
            course_map[c_data["code"]] = course

            for idx, t_data in enumerate(c_data["topics"]):
                topic, _ = Topic.objects.get_or_create(
                    course=course,
                    name=t_data["name"],
                    defaults={
                        "description": t_data["description"],
                        "order": idx + 1,
                    }
                )
                topic_map[(c_data["code"], t_data["name"])] = topic

                # Create Study Material for this topic
                StudyMaterial.objects.get_or_create(
                    course=course,
                    topic=topic,
                    title=f"{course.name} - {topic.name} Revision Notes",
                    defaults={
                        "description": t_data["description"],
                        "content": t_data["notes"],
                    }
                )

        # 2. Create Questions
        created_questions = 0
        for q_data in QUESTIONS_DATA:
            course = course_map.get(q_data["course"])
            topic = topic_map.get((q_data["course"], q_data["topic"]))

            if course:
                Question.objects.get_or_create(
                    course=course,
                    question=q_data["question"],
                    defaults={
                        "topic": topic,
                        "difficulty": q_data["difficulty"],
                        "option_a": q_data["option_a"],
                        "option_b": q_data["option_b"],
                        "option_c": q_data["option_c"],
                        "option_d": q_data["option_d"],
                        "correct_option": q_data["correct_option"],
                        "explanation": q_data["explanation"],
                    }
                )
                created_questions += 1

        # 3. Create Sample Test Results for demo
        c_course = course_map.get("C")
        if c_course:
            TestResult.objects.get_or_create(
                student_name="Alice Kumar",
                course=c_course,
                score=5,
                total_questions=6,
                percentage=83.3,
                passed=True,
                defaults={
                    "answers_data": [
                        {"question_id": 1, "is_correct": True},
                        {"question_id": 2, "is_correct": True},
                        {"question_id": 3, "is_correct": False},
                        {"question_id": 4, "is_correct": True},
                        {"question_id": 5, "is_correct": True},
                        {"question_id": 6, "is_correct": True},
                    ]
                }
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded: {Course.objects.count()} Courses, {Topic.objects.count()} Topics, {Question.objects.count()} Questions, {StudyMaterial.objects.count()} Study Guides!"
            )
        )

