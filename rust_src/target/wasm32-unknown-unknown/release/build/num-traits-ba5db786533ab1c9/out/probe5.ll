; ModuleID = 'probe5.b71181bf671aa0c7-cgu.0'
source_filename = "probe5.b71181bf671aa0c7-cgu.0"
target datalayout = "e-m:e-p:32:32-p10:8:8-p20:8:8-i64:64-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

@alloc_6b522a8b04d611fde6d493cf394b1c36 = private unnamed_addr constant <{ [75 x i8] }> <{ [75 x i8] c"/rustc/75c68cfd2b9870f2953b62d250bd7d0564a7b56d/library/core/src/num/mod.rs" }>, align 1
@alloc_c179541aa0f2429fa1c390c43b78f212 = private unnamed_addr constant <{ ptr, [12 x i8] }> <{ ptr @alloc_6b522a8b04d611fde6d493cf394b1c36, [12 x i8] c"K\00\00\00y\04\00\00\05\00\00\00" }>, align 4
@str.0 = internal unnamed_addr constant [25 x i8] c"attempt to divide by zero"

; probe5::probe
; Function Attrs: nounwind
define hidden void @_ZN6probe55probe17h8748b2a45f437b63E() unnamed_addr #0 {
start:
  %0 = call i1 @llvm.expect.i1(i1 false, i1 false)
  br i1 %0, label %panic.i, label %"_ZN4core3num21_$LT$impl$u20$u32$GT$10div_euclid17h31d459cac3a5f09cE.exit"

panic.i:                                          ; preds = %start
; call core::panicking::panic
  call void @_ZN4core9panicking5panic17h0aceaa97805c87f8E(ptr align 1 @str.0, i32 25, ptr align 4 @alloc_c179541aa0f2429fa1c390c43b78f212) #3
  unreachable

"_ZN4core3num21_$LT$impl$u20$u32$GT$10div_euclid17h31d459cac3a5f09cE.exit": ; preds = %start
  ret void
}

; Function Attrs: nocallback nofree nosync nounwind willreturn memory(none)
declare hidden i1 @llvm.expect.i1(i1, i1) #1

; core::panicking::panic
; Function Attrs: cold noinline noreturn nounwind
declare dso_local void @_ZN4core9panicking5panic17h0aceaa97805c87f8E(ptr align 1, i32, ptr align 4) unnamed_addr #2

attributes #0 = { nounwind "target-cpu"="generic" "target-features"="+atomics,+bulk-memory,+mutable-globals" }
attributes #1 = { nocallback nofree nosync nounwind willreturn memory(none) }
attributes #2 = { cold noinline noreturn nounwind "target-cpu"="generic" "target-features"="+atomics,+bulk-memory,+mutable-globals" }
attributes #3 = { noreturn nounwind }

!llvm.ident = !{!0}

!0 = !{!"rustc version 1.77.0-nightly (75c68cfd2 2024-01-07)"}
