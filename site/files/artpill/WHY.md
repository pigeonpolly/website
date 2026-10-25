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
