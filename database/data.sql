-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

insert into "accounts" ("userId", "name", "provider", "account", "accessKey", "secretKey")
values (1, 'mikelfz', 'AWS', '123123123123', '', '')
