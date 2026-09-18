import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usuariosService } from '@/services/usuarios.service'
import { useAuthStore } from '@/store/useAuthStore'
import type { InstitucionPayload, UsuarioPayload } from '@/types'

export function useInstituciones() {
  return useQuery({
    queryKey: ['instituciones'],
    queryFn: () => usuariosService.listInstituciones(),
  })
}

export function useRolesUsuario() {
  return useQuery({
    queryKey: ['roles-usuario'],
    queryFn: () => usuariosService.listRolesUsuario(),
  })
}

export function useCrearUsuario() {
  const queryClient = useQueryClient()
  const token = useAuthStore((s) => s.token)
  return useMutation({
    mutationFn: (payload: UsuarioPayload) => usuariosService.crearUsuario(token ?? '', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsables'] })
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}

export function useActualizarUsuario() {
  const queryClient = useQueryClient()
  const token = useAuthStore((s) => s.token)
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UsuarioPayload }) =>
      usuariosService.actualizarUsuario(token ?? '', id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsables'] })
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}

export function useEliminarUsuario() {
  const queryClient = useQueryClient()
  const token = useAuthStore((s) => s.token)
  return useMutation({
    mutationFn: (id: number) => usuariosService.eliminarUsuario(token ?? '', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsables'] })
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}

export function useCrearInstitucion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: InstitucionPayload) => usuariosService.crearInstitucion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instituciones'] })
    },
  })
}

export function useActualizarInstitucion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: InstitucionPayload }) =>
      usuariosService.actualizarInstitucion(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instituciones'] })
    },
  })
}

export function useEliminarInstitucion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usuariosService.eliminarInstitucion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instituciones'] })
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}
