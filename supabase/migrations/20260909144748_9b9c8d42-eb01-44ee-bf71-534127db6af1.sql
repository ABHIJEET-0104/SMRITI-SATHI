REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.can_access(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.link_elderly_by_code(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_access(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.link_elderly_by_code(TEXT) TO authenticated;