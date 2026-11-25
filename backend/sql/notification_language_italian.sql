alter table public.aoz_subscribers drop constraint aoz_subscribers_language_check, add constraint aoz_subscribers_language_check check (language in ('ru','en','es','vi','ar','zh','hr','it'));
