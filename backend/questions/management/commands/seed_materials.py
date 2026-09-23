import os
from pathlib import Path
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from questions.models import StudyMaterial

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib import colors

MATERIALS = [
    {
        "subject": "C",
        "title": "C Programming Placement Notes & Cheat Sheet",
        "topic": "Pointers, Memory, Storage Classes & Common Traps",
        "description": "Essential placement revision guide for C programming: pointers, malloc/free, struct padding, and bitwise operations.",
        "filename": "C_Placement_Mastery_Notes.pdf",
        "sections": [
            ("1. Pointer Fundamentals & Memory", [
                "<b>Definition:</b> A pointer is a variable that stores the memory address of another variable.",
                "<b>Dereferencing (*ptr):</b> Accesses or modifies the value stored at the referenced address.",
                "<b>Pointer Arithmetic:</b> Increments pointer address by <code>sizeof(dataType)</code> bytes (e.g. <code>ptr + 1</code> adds 4 bytes for 32-bit int).",
                "<b>Dangling Pointer:</b> Occurs when memory pointed to by a pointer is deallocated (free()), but the pointer is not set to NULL.",
                "<b>Wild Pointer:</b> A pointer that has not been initialized to any valid address and contains random garbage.",
            ]),
            ("2. Dynamic Memory Management (stdlib.h)", [
                "<b>malloc(size):</b> Allocates <code>size</code> contiguous bytes on heap; contents are uninitialized garbage.",
                "<b>calloc(n, size):</b> Allocates contiguous memory for <code>n</code> items and initializes every byte to 0.",
                "<b>realloc(ptr, new_size):</b> Resizes previously allocated block, preserving existing data where possible.",
                "<b>free(ptr):</b> Releases allocated heap memory back to the OS. Avoids memory leaks.",
            ]),
            ("3. Storage Classes & Lifespan", [
                "<b>auto:</b> Default for local variables. Allocated on stack, destroyed upon function exit.",
                "<b>static:</b> Retains value across function calls. Initialized once in data segment (default 0).",
                "<b>extern:</b> Declares global variables defined in other translation units.",
                "<b>register:</b> Hint to compiler to store variable in CPU register for high-speed access.",
            ]),
            ("4. Structure Padding & Memory Alignment", [
                "CPUs access memory in word-sized boundaries (4 or 8 bytes). Compilers insert padding bytes between struct members to align them to natural addresses, maximizing memory bus efficiency.",
            ])
        ]
    },
    {
        "subject": "C++",
        "title": "C++ Object Oriented Programming & STL Guide",
        "topic": "OOP, Virtual Tables, Templates, RAII & STL",
        "description": "Comprehensive reference guide covering virtual functions, diamond problem, smart pointers, and STL containers.",
        "filename": "CPP_OOP_and_STL_Guide.pdf",
        "sections": [
            ("1. Core Object Oriented Pillars in C++", [
                "<b>Encapsulation:</b> Bundling data members and methods together within classes, controlling access via private/protected/public.",
                "<b>Inheritance:</b> Deriving new classes from existing base classes to promote code reusability.",
                "<b>Polymorphism:</b> Compile-time (Function & Operator Overloading) vs Run-time (Virtual Functions & Late Binding).",
                "<b>Abstraction:</b> Exposing essential interfaces while hiding implementation details via Abstract Classes (pure virtual functions <code>virtual void f() = 0;</code>).",
            ]),
            ("2. Virtual Functions & The VTable Mechanism", [
                "When a class declares a virtual function, the compiler inserts a hidden pointer called <b>vptr</b> into each object pointing to a <b>vtable</b> (virtual table of function pointers).",
                "<b>Virtual Destructors:</b> Base classes with virtual functions MUST have virtual destructors. Otherwise, deleting a derived object via a base pointer causes undefined behavior.",
            ]),
            ("3. Multiple Inheritance & The Diamond Problem", [
                "When class D inherits from B and C, both of which inherit from A, D has two duplicate copies of A.",
                "<b>Solution:</b> Use <b>virtual inheritance</b>: <code>class B : virtual public A</code> and <code>class C : virtual public A</code>.",
            ]),
            ("4. Modern C++ Smart Pointers (RAII)", [
                "<b>std::unique_ptr:</b> Exclusive ownership; cannot be copied, only moved. Automatically frees resource upon scope exit.",
                "<b>std::shared_ptr:</b> Shared ownership; uses reference counting. Deletes managed object when reference count hits 0.",
                "<b>std::weak_ptr:</b> Non-owning observer that prevents cyclic reference memory leaks.",
            ])
        ]
    },
    {
        "subject": "Java",
        "title": "Java Core & Collections Framework Handbook",
        "topic": "JVM Internals, Garbage Collection, Strings & Concurrency",
        "description": "High-yield interview handbook covering Java memory model, String pool, Collections hierarchy, and multithreading.",
        "filename": "Java_Core_and_Collections_Handbook.pdf",
        "sections": [
            ("1. Java Virtual Machine (JVM) Architecture", [
                "<b>Class Loader Subsystem:</b> Loads, Links (Verify, Prepare, Resolve), and Initializes .class bytecode.",
                "<b>JVM Memory Areas:</b> Method Area (class metadata), Heap Area (objects & String pool), Stack Area (stack frames & local variables), PC Registers, Native Method Stacks.",
                "<b>Garbage Collection (GC):</b> Automatically reclaims unreachable heap objects. Generational GC separates heap into Young Gen (Eden, S0, S1) and Old Gen (Tenured).",
            ]),
            ("2. String Immutability & String Constant Pool", [
                "Strings are immutable in Java for security (URLs, DB connections), caching (String Pool saves memory), and guaranteed thread safety.",
                "<b>String vs StringBuilder vs StringBuffer:</b> String is immutable. StringBuilder is mutable and non-synchronized (fastest). StringBuffer is mutable and synchronized (thread-safe).",
            ]),
            ("3. Java Collections Framework Comparison", [
                "<b>ArrayList vs LinkedList:</b> ArrayList offers O(1) random access but O(n) insertions/deletions. LinkedList offers O(1) insertions at nodes but O(n) traversal.",
                "<b>HashMap vs Hashtable:</b> HashMap allows 1 null key, is unsynchronized. Hashtable is legacy, synchronized, and disallows nulls.",
                "<b>HashMap Internals:</b> Array of buckets (Node/Entry). Uses hashCode() to find bucket, handles collisions via Linked Lists; converted to Red-Black Trees when bucket size exceeds 8 (TREEIFY_THRESHOLD in Java 8+).",
            ]),
            ("4. Exception Hierarchy & Thread Lifecycle", [
                "Throwable -> Error (Unchecked, e.g. OutOfMemoryError) & Exception. Exception -> RuntimeException (Unchecked) & Checked Exceptions (IOException, SQLException).",
                "Thread States: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED.",
            ])
        ]
    },
    {
        "subject": "Unix",
        "title": "Unix / Linux Operating System & Commands Cheat Sheet",
        "topic": "Processes, Inodes, Permissions, Signals & CLI Tools",
        "description": "Practical Unix systems guide for technical interviews: process management, permissions, file system internals, and pipes.",
        "filename": "Unix_Architecture_and_Commands_CheatSheet.pdf",
        "sections": [
            ("1. Unix Architecture & Process Management", [
                "<b>Kernel vs Shell:</b> Kernel interacts with hardware, schedules processes, manages memory. Shell is the command interpreter.",
                "<b>Process Creation (fork & exec):</b> <code>fork()</code> creates a clone of the calling process (child). <code>exec()</code> overlays the process with a new executable.",
                "<b>Zombie Process:</b> Terminated child process whose exit status has not been retrieved by parent via <code>wait()</code>.",
                "<b>Orphan Process:</b> Process whose parent has terminated; adopted by <code>init</code> (PID 1) or <code>systemd</code>.",
            ]),
            ("2. File System, Inodes & Links", [
                "<b>Inode:</b> Data structure containing file metadata (permissions, owner, size, timestamps, block pointers). Inode does NOT contain filename.",
                "<b>Hard Link:</b> Direct pointer to the file's inode number. Deleting one hard link does not delete file data until link count drops to 0.",
                "<b>Soft Link (Symlink):</b> Special file containing the pathname string to another target file.",
            ]),
            ("3. File Permissions (rwxrwxrwx)", [
                "Permission triplets: Owner, Group, Others. <code>r=4</code>, <code>w=2</code>, <code>x=1</code>.",
                "Example: <code>chmod 755 file</code> -> Owner: rwx (7), Group: r-x (5), Others: r-x (5).",
                "<code>umask:</code> Default permission mask subtracted from 666 (files) or 777 (directories).",
            ]),
            ("4. Essential Signals & Command Utilities", [
                "<b>SIGKILL (9):</b> Immediately kills process; CANNOT be caught or ignored.",
                "<b>SIGTERM (15):</b> Polite request to terminate; allows clean-up.",
                "<b>Piping (|) & Redirection (&gt;, &gt;&gt;, &lt;):</b> Passes stdout of one command as stdin to another.",
                "<b>Top Commands:</b> <code>grep</code> (search text), <code>sed</code> (stream editor), <code>awk</code> (pattern scanning), <code>find</code> (locate files), <code>ps aux</code>, <code>top</code>.",
            ])
        ]
    }
]

def build_pdf(filepath, mat_data):
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=6,
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#475569'),
        spaceAfter=14,
    )
    section_head_style = ParagraphStyle(
        'SecHead',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#1e40af'),
        spaceBefore=10,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=5,
    )

    story = []

    # Title & Topic
    story.append(Paragraph(f"<b>{mat_data['title']}</b>", title_style))
    story.append(Paragraph(f"Subject: <b>{mat_data['subject']}</b> | Topic: {mat_data['topic']}", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#cbd5e1'), spaceBefore=2, spaceAfter=12))

    # Sections
    for sec_title, bullets in mat_data['sections']:
        story.append(Paragraph(sec_title, section_head_style))
        for bullet in bullets:
            story.append(Paragraph(f"• {bullet}", body_style))
        story.append(Spacer(1, 6))

    # Footer note
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#e2e8f0'), spaceBefore=6, spaceAfter=8))
    footer_text = "Placement Preparation Portal • Read the material carefully before taking the subject practice test."
    story.append(Paragraph(footer_text, ParagraphStyle('Footer', parent=body_style, fontSize=8, textColor=colors.HexColor('#94a3b8'))))

    doc.build(story)

class Command(BaseCommand):
    help = 'Seeds sample PDF study materials for C, C++, Java, and Unix'

    def handle(self, *args, **options):
        media_dir = Path(settings.MEDIA_ROOT) / 'study_materials'
        media_dir.mkdir(parents=True, exist_ok=True)

        created_count = 0
        for mat in MATERIALS:
            pdf_path = media_dir / mat['filename']
            # Generate the PDF file
            build_pdf(str(pdf_path), mat)

            # Build markdown-style content for editing
            content_parts = [
                f"# {mat['title']}",
                f"Subject: {mat['subject']} | Concept: {mat['topic']}\n",
                mat['description'],
                ""
            ]
            for sec_title, bullets in mat['sections']:
                content_parts.append(f"## {sec_title}")
                for b in bullets:
                    clean_b = b.replace('<b>', '**').replace('</b>', '**').replace('<code>', '`').replace('</code>', '`')
                    content_parts.append(f"• {clean_b}")
                content_parts.append("")
            content_text = "\n".join(content_parts)

            # Check if record exists
            existing = StudyMaterial.objects.filter(subject=mat['subject'], title=mat['title']).first()
            if not existing:
                with open(pdf_path, 'rb') as f:
                    sm = StudyMaterial(
                        subject=mat['subject'],
                        title=mat['title'],
                        topic=mat['topic'],
                        description=mat['description'],
                        content=content_text,
                    )
                    sm.file.save(mat['filename'], File(f), save=True)
                    created_count += 1
            else:
                existing.content = content_text
                existing.topic = mat['topic']
                existing.description = mat['description']
                existing.save()
                self.stdout.write(f"Updated existing material with editable content: {mat['title']}")

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded {created_count} study material PDFs! Total in DB: {StudyMaterial.objects.count()}"
            )
        )

