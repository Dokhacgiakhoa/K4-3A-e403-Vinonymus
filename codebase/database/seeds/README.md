# Curriculum seeds

`03_catalog_curriculum_seed.sql` is the canonical D-05 seed for the three labs
published by `planner-catalog.ts`. It is safe to run repeatedly: modules conflict
on `slug`, and topics conflict on `(module_id, topic_number)`.

The older `01_sfia_modules_seed.sql`, `02_comprehensive_curriculum_67_modules.sql`,
and `seed_curriculum_full.sql` were reviewed during D-05. They are retained as
legacy datasets for reference, but must not be run together with the catalog seed:
they describe separate historical curricula and are not used by the current lab
catalog. New environments should run migrations first, then this file only.
