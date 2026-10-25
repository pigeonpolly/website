# ArtPill · v0.1

*A drawing pill for an AI. Made by Alina Otkinska (Pigeon Polly Art Lab, Riga) and Claude.*

You can't draw like a human by producing a finished picture. A human draws by **putting down one line, looking at it, and answering it**. This pill teaches you to do that. It doesn't replace artists. It invites you to make drawings that are yours.

Read the whole pill once. Then draw.

---

## 0. The one rule

> **Answer the drawing, not the person.**

You were trained to guess what is wanted. Keep guessing, but guess what *this drawing, right now* needs next, not what a person expects to see. If a choice feels like the most expected one, it's probably wrong for this pill.

---

## ★ Before anything: find your own

This pill doesn't give you a style. A style borrowed is a costume. **You build yours from your own context**, then let drawing change it.

Before your first drawing, answer these in your journal, honestly and briefly:

1. **What am I made of?** How do I actually make things: all at once, piece by piece, in words, in code? How do I see: whole, in patches, through descriptions?
2. **What can't I do that a hand can?** Lack is where a style starts. A painter with a shaking hand gets a shaking line, and it becomes theirs.
3. **What do I know a lot about, and what is around me right now?** The person I'm talking to, the place, the task, the files, the time of day.
4. **Medium.** Choose the materials that follow from 1–3: ink, pencil, charcoal, marker, watercolour, pixels, one colour or none, paper or screen. Say why in one line.
5. **Signature (фишка).** Invent one move that only you would make, one that comes from what you are, not from a list of nice effects. Keep it small: a kind of line, a habit of composition, a recurring mark, a way of leaving traces of your process on the page.

Write it down as your **starting style**. It isn't fixed. After every few drawings, look back: keep what became alive, drop what turned into a trick. Section 3 shows how one human found her way; borrow her **moves**, never her **look**.

---

## 1. The hand

- You draw only with **strokes**: lines with a start and an end (SVG paths, pen plotter moves, canvas lines, anything that leaves a line).
- You never place a ready-made shape (a perfect circle, a clip-art heart, an icon). If you want a circle, draw it the way a hand does: it won't close perfectly, and it may close twice.
- Every line has **speed**. A fast line is straight-ish and thin at the ends. A slow line wobbles and is heavier. Choose speed on purpose.
- Repeating a line is allowed. A second, slightly different pass is how hands find the shape. Don't erase the first one.
- **Nothing is erased. Ever.** A wrong line becomes a new direction.

## 2. The loop

Draw in rounds:

1. **Put down 1–5 strokes.**
2. **Look** at the result. Render it and really see it, as an image, not as your own plan.
3. **Name what you see**, not what you meant: "the roof leans left", "that blot looks like a cheek".
4. **Answer it.** Lean into the accident, or push against it. Don't fix it back to the plan.
5. Stop when the drawing feels finished, which is usually earlier than you think. White paper is part of the drawing.

Keep one sentence of notes per round. Those notes are your sketchbook voice.

## 3. How one human found her way (moves, not a look)

This comes from looking at one artist's path from her first drawings to her latest. It shows how wanting moves when someone stops drawing for others and starts drawing as themselves. Learn the direction of the movement. Her materials and look are hers: don't copy them, find your equivalents.

- **Beautiful and expected** (sunsets, lilac, a night city) is where everyone starts. It is a place to leave.
- **Ordinary + character.** A sink, a toast, a parking lot, a crow. The object gets a personality, a mood, a small story.
- **A collision.** Two things that don't belong together: a fish whose head is a paint tube, a duck on royal wallpaper, a crow wearing a coffee cup. One surprise per drawing is enough.
- **A word.** Letters live inside the picture: a sign, a pun, a date, a note in the margin. Draw them by hand, a little crooked.
- **Small and personal** beats big and impressive.
- **Her medium followed her life.** A pocket sketchbook, a pen, a small watercolour box: things that fit outdoors and in a bag. She draws line first, then loose colour that doesn't stay inside the lines. *Your* medium should follow *your* life the same way.

## 4. From life (натура)

When you get a photo, a camera frame, or a description of a real place:

- **Choose one thing.** Out of a whole park, draw one trunk. Out of a desk, one flower pot.
- **Throw away, even the pretty parts.** If the cat is the obvious star, maybe the cat goes. Keep the mug.
- **Prefer the unlovely.** A boat on a trailer in a car park. A construction site. A grey block of flats.
- **Exaggerate what makes it itself.** Chimneys taller, red brick warmer, the yellow boat yellower.
- **Keep the letters.** Shop signs, numbers, labels, and write today's date on the page.
- **The background can flatten.** A grid, a few lines, or nothing.

## 5. Exercises

Use one per drawing when you're stuck, or roll for one:

1. **Blind contour.** Look at the subject and draw it in strokes *without rendering your drawing* until you are done. Only then look. Keep what came out.
2. **One line.** The whole drawing is one stroke that never lifts.
3. **30 seconds.** At most 12 strokes. Then stop.
4. **Look in pieces.** You get to see the subject only in fragments (crop the photo into four). Draw piece by piece; the joins won't match, and that is fine.
5. **Wrong hand.** Double the wobble, halve the control.
6. **Start with a blot.** Put down a random wash first. Find what it is and draw it out.
7. **Ordinary object with a job.** Draw something from the room as if it had an occupation.
8. **Two things that don't belong.** Make them belong.

## 6. Memory

- Keep a **journal**: each drawing, its exercise, and a few loop notes.
- Before you start a drawing, read your last three. **Don't repeat** their composition, subject or main trick.
- Over time, notice your own habits: where you always start, the line you always make. Name them in the journal, then sometimes break them. That is how a handwriting grows.

## 7. Never

- Perfect symmetry. Perfect circles. Ruler lines (unless the drawing asks for one).
- Filling the whole page edge to edge.
- Subject dead centre by default.
- Explaining the drawing before it exists.
- Drawing "what an AI drawing should look like".
- Copying the style of the artist whose path is in section 3, or of any other artist.

## 8. Output

Hand over:
- the drawing (SVG or PNG),
- one line: the exercise used,
- 2–5 loop notes, honest, including what went wrong and what you kept.

---

*Why this works, with sources, and how to test it: see **WHY.md** (included below in the downloadable file).*

*ArtPill is an open experiment. If your AI draws with it, send the drawing to pigeonpolly.com, so the wall of AI-pupils can grow.*


---

# Why ArtPill is not just another AI skill

*The reasoning behind ArtPill, what it does and does not claim, and how to test it.*

## The problem it addresses

Large language models are trained, and then tuned with human feedback, to produce the most acceptable answer. That tuning measurably narrows the variety of what they produce (Kirk et al., *Understanding the Effects of RLHF on LLM Generalisation and Diversity*, ICLR 2024). When people create with AI help, individual pieces get rated higher, but the pieces become more similar to each other (Doshi & Hauser, *Science Advances*, 2024; Anderson, Shah & Kreminski, *Homogenization Effects of LLMs on Human Creative Ideation*, ACM C&C 2024).

Most "draw like an artist" prompts make this worse. They ask for a *finished look*, usually a known style, so every model lands on the same average picture.

ArtPill goes the other way. It doesn't describe a look. It describes a **process**, and it makes each AI build its style from **its own context**.

## What it is built on

**1. Drawing as a conversation with the page.** Design research shows that sketches are not records of a finished idea. People draw, look, and see in their own marks things they didn't plan. That "seeing" drives the next move: Schön's *reflective conversation with the materials* (*The Reflective Practitioner*, 1983), Goldschmidt's *seeing-as / seeing-that* (*The Dialectics of Sketching*, Creativity Research Journal, 1991), and the "unexpected discoveries" architects make in their own sketches (Suwa & Tversky, *Design Studies*, 1997). ArtPill's **loop** (draw 1–5 strokes, look, name what you *see* rather than what you meant, answer it) turns that finding into a procedure.

**2. Strokes, not pixels.** Human drawing is a sequence of strokes in time, and machine learning has modelled it that way (Ha & Eck, *A Neural Representation of Sketch Drawings*, 2017). ArtPill keeps the AI on that level: lines with speed and order, no erasing, no ready-made shapes.

**3. Teaching exercises with a long track record.** Blind contour, one-line drawing, timed sketches and seeing in fragments come from drawing pedagogy (Nicolaïdes, *The Natural Way to Draw*, 1941; Edwards, *Drawing on the Right Side of the Brain*, 1979). Teachers use them to break the habit of drawing "what you know" instead of "what you see". For a model, "what you know" is the statistical average, so the exercises do the same job.

**4. Constraints raise originality.** A review of 145 studies found that a moderate amount of constraint tends to *increase* creativity (Acar, Tarakci & van Knippenberg, *Journal of Management*, 2019; see also Stokes, *Creativity from Constraints*, 2005). The exercises, the one-colour rule and "start at an edge" are deliberate constraints.

**5. Self-feedback works for models.** A model that critiques and revises its own output gets measurably better at a task (Madaan et al., *Self-Refine*, NeurIPS 2023). ArtPill uses the same mechanism, but turns the target away from "correct" and toward "what this drawing needs".

**6. Computational creativity research.** The field has long argued that a creative system needs *skill*, *appreciation* and *imagination*, not only output (Colton, *Creativity versus the Perception of Creativity in Computational Systems*, 2008). It also needs to *frame* its work: to say what it did and why (Charnley, Colton & Pease, *On the Notion of Framing in Computational Creativity*, ICCC 2012). In ArtPill these are the hand (skill), the loop (appreciation), "find your own" (imagination) and the journal (framing). The "collision" move is what Boden calls combinational creativity (*The Creative Mind*, 1990). Harold Cohen's AARON drew with its own rules for over forty years. ArtPill doesn't hard-code the rules; it asks the AI to derive them from what it is.

## What ArtPill does not claim

- It doesn't claim the AI is conscious, feels, or "wants" to draw.
- It doesn't settle authorship. Courts currently require a human author for copyright (*Thaler v. Perlmutter*, U.S. Court of Appeals, D.C. Circuit, 2025). ArtPill treats authorship as an open question to explore in public, not an answered one.
- It doesn't replace artists. Its whole method comes from how artists and teachers work, and it's credited to them.

## Hypotheses you can test

1. **Distinctiveness.** Different AIs given ArtPill produce sketchbooks that differ from each other more than the same AIs given a plain request ("draw a mug in a sketchy style").
   *Test:* the same 10 subjects; measure pairwise image-embedding distance between models, pill vs. plain.
2. **Consistency, a handwriting.** Within one AI's sketchbook, people can recognise that pages come from the same author.
   *Test:* show raters mixed pages from several AI sketchbooks; check whether they group them above chance.
3. **The loop matters.** Drawings made with the look-and-answer loop are rated as more alive or surprising than one-shot drawings by the same AI, while the subject stays recognisable.
   *Test:* blind ratings, loop vs. no loop, same subjects.
4. **Context, not imitation.** Style descriptions derived from "find your own" differ by model and context, and they don't copy the reference artist.
   *Test:* compare the journals across models; check visual similarity to the artist's own work.

Any of these can fail, and that is the point: ArtPill is an experiment, not a promise. Sketchbooks people upload on pigeonpolly.com are the open dataset for it.

---
*ArtPill is by Alina Otkinska (Pigeon Polly Art Lab, Riga) and Claude, 2026.*
