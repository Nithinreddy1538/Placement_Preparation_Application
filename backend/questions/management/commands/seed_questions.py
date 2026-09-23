from django.core.management.base import BaseCommand
from questions.models import Question

QUESTIONS_DATA = [
    # ------------------ C QUESTIONS ------------------
    {
        "question": "What is the output of the following C code snippet?\n\n#include <stdio.h>\nint main() {\n    int a = 10;\n    int *ptr = &a;\n    *ptr = *ptr * 2;\n    printf(\"%d\", a);\n    return 0;\n}",
        "subject": "C",
        "topic": "Pointers",
        "difficulty": "Easy",
        "option_a": "10",
        "option_b": "20",
        "option_c": "Garbage value",
        "option_d": "Compilation error",
        "correct_option": "B",
        "explanation": "*ptr dereferences the memory location of variable a. Multiplying *ptr by 2 directly modifies the value stored at a to 20."
    },
    {
        "question": "Which of the following functions is used to allocate memory dynamically and initialize all allocated bytes to zero?",
        "subject": "C",
        "topic": "Dynamic Memory Allocation",
        "difficulty": "Easy",
        "option_a": "malloc()",
        "option_b": "calloc()",
        "option_c": "realloc()",
        "option_d": "alloc()",
        "correct_option": "B",
        "explanation": "calloc() takes number of elements and size of each element, allocates the total memory requested, and initializes every byte to 0. malloc() leaves memory uninitialized (garbage)."
    },
    {
        "question": "What is the default storage class for a local variable declared inside a function in C?",
        "subject": "C",
        "topic": "Storage Classes",
        "difficulty": "Easy",
        "option_a": "auto",
        "option_b": "static",
        "option_c": "extern",
        "option_d": "register",
        "correct_option": "A",
        "explanation": "Variables declared inside a block or function without a storage class specifier have the 'auto' storage class by default."
    },
    {
        "question": "What will be the result of sizeof(void*) on a standard 64-bit architecture in C?",
        "subject": "C",
        "topic": "Pointers & Architecture",
        "difficulty": "Medium",
        "option_a": "2 bytes",
        "option_b": "4 bytes",
        "option_c": "8 bytes",
        "option_d": "Undefined",
        "correct_option": "C",
        "explanation": "On a 64-bit platform, memory addresses are 64 bits wide, which means any pointer type (including void*) requires 8 bytes."
    },
    {
        "question": "What is a 'dangling pointer' in C?",
        "subject": "C",
        "topic": "Memory Management",
        "difficulty": "Medium",
        "option_a": "A pointer initialized to NULL",
        "option_b": "A pointer that points to a memory location that has already been deallocated or freed",
        "option_c": "A pointer that has not been initialized to any valid address",
        "option_d": "A pointer pointing to constant read-only memory",
        "correct_option": "B",
        "explanation": "A dangling pointer arises when the object it points to is deleted or deallocated (via free()), without the pointer being modified to point to NULL."
    },
    {
        "question": "In C, what is the output of the expression: printf(\"%d\", 5 << 2); ?",
        "subject": "C",
        "topic": "Bitwise Operators",
        "difficulty": "Medium",
        "option_a": "10",
        "option_b": "20",
        "option_c": "25",
        "option_d": "2",
        "correct_option": "B",
        "explanation": "Left shift operator (<<) multiplies the number by 2^n. Here 5 << 2 = 5 * 2^2 = 5 * 4 = 20."
    },
    {
        "question": "What causes structure padding in C?",
        "subject": "C",
        "topic": "Structures & Memory",
        "difficulty": "Hard",
        "option_a": "Compiler alignment requirements to ensure data types fall on naturally aligned memory boundaries",
        "option_b": "Overhead required for dynamic dispatch",
        "option_c": "Garbage collection tagging",
        "option_d": "Padding added by the linker for relocation tables",
        "correct_option": "A",
        "explanation": "CPUs read memory more efficiently in word-sized chunks (e.g. 4 or 8 bytes). Compilers insert unused bytes between struct members so that multi-byte variables align to memory addresses divisible by their size."
    },
    {
        "question": "What is the return type of a function pointer defined as: int (*func)(double, char); ?",
        "subject": "C",
        "topic": "Function Pointers",
        "difficulty": "Hard",
        "option_a": "Pointer to double",
        "option_b": "Pointer to int",
        "option_c": "int",
        "option_d": "char",
        "correct_option": "C",
        "explanation": "The syntax indicates func is a pointer to a function taking (double, char) as parameters and returning an integer (int)."
    },

    # ------------------ C++ QUESTIONS ------------------
    {
        "question": "Which C++ concept enables runtime polymorphism?",
        "subject": "C++",
        "topic": "Object Oriented Programming",
        "difficulty": "Easy",
        "option_a": "Function Overloading",
        "option_b": "Virtual Functions",
        "option_c": "Templates",
        "option_d": "Operator Overloading",
        "correct_option": "B",
        "explanation": "Virtual functions enable late binding (runtime polymorphism) via the virtual table (vtable) and vptr mechanism."
    },
    {
        "question": "What happens if a base class destructor is NOT declared virtual in C++ and a derived object is deleted via a base pointer?",
        "subject": "C++",
        "topic": "Constructors & Destructors",
        "difficulty": "Medium",
        "option_a": "Both base and derived destructors are called normally",
        "option_b": "Only the derived destructor is called",
        "option_c": "Only the base destructor is called, causing undefined behavior / resource leaks",
        "option_d": "Compile-time error",
        "correct_option": "C",
        "explanation": "Without a virtual destructor in the base class, calling delete on a base pointer invokes only the base destructor, leaving derived class resources unreleased (undefined behavior)."
    },
    {
        "question": "Which of the following cannot be an abstract class in C++?",
        "subject": "C++",
        "topic": "OOP & Polymorphism",
        "difficulty": "Easy",
        "option_a": "A class containing at least one pure virtual function (= 0)",
        "option_b": "A class with only private members and no pure virtual functions",
        "option_c": "A class inheriting a pure virtual function without implementing it",
        "option_d": "An interface class with only virtual methods",
        "correct_option": "B",
        "explanation": "An abstract class in C++ requires at least one pure virtual function (e.g. virtual void func() = 0;). Having only private members does not make it abstract."
    },
    {
        "question": "In the C++ Standard Template Library (STL), what is the worst-case time complexity of searching in std::unordered_map?",
        "subject": "C++",
        "topic": "STL & Data Structures",
        "difficulty": "Medium",
        "option_a": "O(1)",
        "option_b": "O(log n)",
        "option_c": "O(n)",
        "option_d": "O(n log n)",
        "correct_option": "C",
        "explanation": "Average case is O(1), but when hash collisions occur on all elements (e.g., all keys hash to the same bucket), the search degrades to O(n)."
    },
    {
        "question": "How is the 'Diamond Problem' in C++ multiple inheritance resolved?",
        "subject": "C++",
        "topic": "Inheritance",
        "difficulty": "Medium",
        "option_a": "Using Virtual Inheritance (virtual keyword before base class)",
        "option_b": "Using private inheritance",
        "option_c": "Using static cast",
        "option_d": "Using friend classes",
        "correct_option": "A",
        "explanation": "Virtual inheritance ensures that only one copy of the common base class's subobject is included in the most derived class."
    },
    {
        "question": "What is the purpose of std::unique_ptr in modern C++?",
        "subject": "C++",
        "topic": "Smart Pointers & RAII",
        "difficulty": "Hard",
        "option_a": "Allows multiple pointers to share ownership with reference counting",
        "option_b": "Sole owner of a dynamically allocated object that automatically deletes the resource when it goes out of scope",
        "option_c": "Acts as a non-owning weak observer for shared_ptr",
        "option_d": "Allocates memory on the stack instead of the heap",
        "correct_option": "B",
        "explanation": "std::unique_ptr enforces exclusive ownership; it cannot be copied (only moved), and it frees the allocated memory automatically when destroyed."
    },
    {
        "question": "What is RAII in C++?",
        "subject": "C++",
        "topic": "Memory & Idioms",
        "difficulty": "Hard",
        "option_a": "Runtime Allocation In Interface",
        "option_b": "Resource Acquisition Is Initialization",
        "option_c": "Recursive Array Index Iteration",
        "option_d": "Random Access Iterator Interface",
        "correct_option": "B",
        "explanation": "Resource Acquisition Is Initialization (RAII) ties resource lifecycle to object lifetime: resources are acquired in constructors and released in destructors."
    },

    # ------------------ JAVA QUESTIONS ------------------
    {
        "question": "Why are String objects immutable in Java?",
        "subject": "Java",
        "topic": "Strings & Memory",
        "difficulty": "Easy",
        "option_a": "To allow String Pool caching, enhance security, and ensure thread-safety",
        "option_b": "Because the JVM has no garbage collector for Strings",
        "option_c": "Because Strings are primitive types in Java",
        "option_d": "To prevent subclassing of Object",
        "correct_option": "A",
        "explanation": "Immutability allows String interning (String Constant Pool), prevents unauthorized modification of sensitive data (passwords, network sockets), and guarantees thread-safety."
    },
    {
        "question": "What is the difference between '==' and '.equals()' when comparing objects in Java?",
        "subject": "Java",
        "topic": "Core Java",
        "difficulty": "Easy",
        "option_a": "'==' compares values; '.equals()' compares memory addresses",
        "option_b": "'==' compares memory addresses (reference equality); '.equals()' compares logical content equality",
        "option_c": "There is no difference; both are interchangeable",
        "option_d": "'.equals()' is only for primitives",
        "correct_option": "B",
        "explanation": "'==' checks whether both references point to the exact same memory location, while .equals() tests logical equality (as overridden by the class, e.g., String)."
    },
    {
        "question": "Which of the following is true about HashMap and Hashtable in Java?",
        "subject": "Java",
        "topic": "Collections Framework",
        "difficulty": "Medium",
        "option_a": "Hashtable is synchronized and does not permit null keys or values; HashMap is non-synchronized and permits one null key",
        "option_b": "HashMap is thread-safe; Hashtable is not",
        "option_c": "Hashtable is faster than HashMap",
        "option_d": "Both permit null keys and null values",
        "correct_option": "A",
        "explanation": "HashMap is non-synchronized (faster, allows 1 null key and multiple null values), whereas Hashtable is legacy, synchronized, and throws NullPointerException on null keys/values."
    },
    {
        "question": "What happens when an unhandled exception occurs inside a thread in Java?",
        "subject": "Java",
        "topic": "Exception Handling & Concurrency",
        "difficulty": "Medium",
        "option_a": "The whole JVM terminates immediately",
        "option_b": "The specific thread terminates, and the JVM continues running other non-daemon threads",
        "option_c": "The exception is automatically caught and logged by System.out",
        "option_d": "The thread pauses and restarts from the beginning",
        "correct_option": "B",
        "explanation": "An unhandled exception terminates only that particular thread unless an UncaughtExceptionHandler is configured. Other non-daemon threads continue running."
    },
    {
        "question": "What is the contract between equals() and hashCode() in Java?",
        "subject": "Java",
        "topic": "Core Java",
        "difficulty": "Hard",
        "option_a": "If two objects have the same hashCode, they must be equal via equals()",
        "option_b": "If two objects are equal according to equals(), they must produce the same hashCode() integer",
        "option_c": "Both must return identical values regardless of equality",
        "option_d": "hashCode() is only called if equals() returns false",
        "correct_option": "B",
        "explanation": "If a.equals(b) is true, then a.hashCode() MUST equal b.hashCode(). However, having identical hashCodes does not require the objects to be equal (hash collision)."
    },
    {
        "question": "What is the difference between final, finally, and finalize in Java?",
        "subject": "Java",
        "topic": "JVM & Keywords",
        "difficulty": "Medium",
        "option_a": "final is a keyword; finally is a block executed after try/catch; finalize was a method invoked before GC",
        "option_b": "They are identical keywords used in different versions of Java",
        "option_c": "finally is for constants; final is for exception handling; finalize is for interfaces",
        "option_d": "finalize is mandatory for closing DB connections",
        "correct_option": "A",
        "explanation": "'final' makes variables constant / classes unextendable / methods unoverridable. 'finally' is a clean-up block in try-catch-finally. 'finalize()' is an Object method invoked before garbage collection (deprecated in Java 9+)."
    },
    {
        "question": "In Java 8+, how do default methods in interfaces handle the multiple interface inheritance conflict?",
        "subject": "Java",
        "topic": "Java 8 Features",
        "difficulty": "Hard",
        "option_a": "The compiler automatically picks the method from the interface declared first",
        "option_b": "The compiler throws a compilation error requiring the implementing class to explicitly override and resolve the method",
        "option_c": "The JVM throws a RuntimeException at runtime",
        "option_d": "Default methods cannot share names across interfaces",
        "correct_option": "B",
        "explanation": "If two interfaces provide the same default method signature and a class implements both, the compiler flags an ambiguity error. The implementing class must override the method explicitly (e.g. InterfaceA.super.method())."
    },

    # ------------------ UNIX QUESTIONS ------------------
    {
        "question": "What numerical value does the permission 'rwxr-xr--' represent in Unix file permissions?",
        "subject": "Unix",
        "topic": "File Permissions",
        "difficulty": "Easy",
        "option_a": "754",
        "option_b": "764",
        "option_c": "654",
        "option_d": "755",
        "correct_option": "A",
        "explanation": "rwx = 4+2+1 = 7 (owner), r-x = 4+0+1 = 5 (group), r-- = 4+0+0 = 4 (others). Thus, the octal value is 754."
    },
    {
        "question": "Which Unix command displays real-time system performance and active process CPU/memory usage?",
        "subject": "Unix",
        "topic": "System Monitoring",
        "difficulty": "Easy",
        "option_a": "ps",
        "option_b": "top",
        "option_c": "df",
        "option_d": "ls",
        "correct_option": "B",
        "explanation": "The 'top' command provides an ongoing, real-time look at processor activity and lists tasks/processes consuming resources."
    },
    {
        "question": "What is a 'zombie process' in Unix?",
        "subject": "Unix",
        "topic": "Process Management",
        "difficulty": "Medium",
        "option_a": "A process running with root privileges that cannot be stopped",
        "option_b": "A process that has finished execution but whose exit status hasn't been read by its parent via wait()",
        "option_c": "A process whose parent terminated, leaving it adopted by init",
        "option_d": "A process stuck in an infinite CPU loop",
        "correct_option": "B",
        "explanation": "When a child process terminates, its entry remains in the process table until the parent reads its exit status using wait(). During this time, it is in a zombie (defunct) state."
    },
    {
        "question": "What is the key difference between a hard link and a soft (symbolic) link in Unix?",
        "subject": "Unix",
        "topic": "File System & Inodes",
        "difficulty": "Medium",
        "option_a": "A hard link points directly to the file's inode and shares its data blocks; a soft link is an independent file pointing to the pathname of the target",
        "option_b": "Hard links can span across different filesystems; soft links cannot",
        "option_c": "Deleting the original file keeps soft links valid",
        "option_d": "Soft links cannot link to directories",
        "correct_option": "A",
        "explanation": "A hard link shares the exact inode number with the original file. A symbolic (soft) link has its own inode and simply contains the path string to the target file."
    },
    {
        "question": "Which signal CANNOT be caught, blocked, or ignored by any process in Unix?",
        "subject": "Unix",
        "topic": "Signals",
        "difficulty": "Medium",
        "option_a": "SIGINT",
        "option_b": "SIGTERM",
        "option_c": "SIGKILL",
        "option_d": "SIGHUP",
        "correct_option": "C",
        "explanation": "SIGKILL (signal 9) and SIGSTOP (signal 19) cannot be caught, blocked, or ignored. The kernel immediately terminates or stops the process."
    },
    {
        "question": "What will the following command do in Unix: `find . -type f -name \"*.log\" -exec rm -f {} +` ?",
        "subject": "Unix",
        "topic": "Command Line Utilities",
        "difficulty": "Hard",
        "option_a": "Deletes all directories ending in .log",
        "option_b": "Finds all regular files ending with .log from the current directory recursively and deletes them in batched rm executions",
        "option_c": "Displays logs without deleting",
        "option_d": "Returns a syntax error because + is invalid",
        "correct_option": "B",
        "explanation": "`-type f` searches for regular files, `-name \"*.log\"` matches filenames ending with .log, and `-exec rm -f {} +` groups matched files to run `rm -f` with multiple arguments efficiently."
    },
    {
        "question": "What is the difference between fork() and vfork() system calls in Unix?",
        "subject": "Unix",
        "topic": "System Calls",
        "difficulty": "Hard",
        "option_a": "vfork() creates a child that shares the address space of the parent and suspends the parent until the child calls exec() or _exit()",
        "option_b": "fork() shares memory space without copy-on-write; vfork() duplicates memory immediately",
        "option_c": "vfork() does not create a new process",
        "option_d": "fork() creates threads while vfork() creates processes",
        "correct_option": "A",
        "explanation": "vfork() was introduced to avoid copying the parent's page tables when the child immediately calls exec(). It halts the parent and shares the parent's memory pages until exec() or _exit()."
    }
]

class Command(BaseCommand):
    help = 'Seeds initial placement preparation questions into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Delete existing questions before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            deleted_count, _ = Question.objects.all().delete()
            self.stdout.write(self.style.WARNING(f'Cleared {deleted_count} existing questions.'))

        created_count = 0
        skipped_count = 0

        for item in QUESTIONS_DATA:
            obj, created = Question.objects.get_or_create(
                question=item['question'],
                defaults={
                    'subject': item['subject'],
                    'topic': item['topic'],
                    'difficulty': item['difficulty'],
                    'option_a': item['option_a'],
                    'option_b': item['option_b'],
                    'option_c': item['option_c'],
                    'option_d': item['option_d'],
                    'correct_option': item['correct_option'],
                    'explanation': item['explanation'],
                }
            )
            if created:
                created_count += 1
            else:
                skipped_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Seeding completed successfully! Created: {created_count}, Skipped (already existed): {skipped_count}. Total in DB: {Question.objects.count()}'
            )
        )

