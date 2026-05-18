#include<stdio.h>
#include<math.h>

void clear_input_buffer(void);
int select_mode(void);
void input_double(const char *msg, double *out);
void input_int(const char *msg, int *out);
void input_date(const char *msg, int *out);
void input_weight(const char *msg, double *out);
void input_ratio(const char *msg, double *out);
void date_Culcuration(double current_weight, int *number_days, double goal_weight, double reduce_ratio);
void weight_Culcuration(double current_weight, int number_days, double *goal_weight, double reduce_ratio);
void ratio_Culcuration(double current_weight, int number_days, double goal_weight, double *reduce_ratio);
void do_case1(void);
void do_case2(void);
void do_case3(void);
void print_daily_goals(double current_weight, int number_days, double goal_weight, double reduce_ratio);

int main(void){
    double current_weight = 0,  goal_weight = 0, reduce_ratio = 0;
    int number_days = 0;

    while(1){   
        switch(select_mode()){
            case 1:
                do_case1();
                break;

            case 2:
                do_case2();
                break;

            case 3:
                do_case3();
                break;

            case EOF:
                printf("\nプログラムが終了しました。");
                return 0;
        }
    }
    printf("\nプログラムが終了しました。");
    return 0;
}

void clear_input_buffer(void){
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

int select_mode(void){
    while(1){
        int i = 0;            
        printf("モードを選択してください。（日数計算…1　体重計算…2　割合計算…3　終了する…EOF [ctrl + D]）\nモード：");
        if(scanf("%d", &i) == EOF) return EOF;
        else if(i != 1 && i != 2 && i != 3){
            printf("入力が無効です。有効な値を入力してください（1 or 2 or 3 or EOF [ctrl + D]）\n");
            clear_input_buffer();
            continue;
        }
        return i;
    }
}

void input_double(const char *msg, double *out){
    while(1){
        printf("%s", msg);
        
        switch(scanf("%lf", out)){
            case 1:
                clear_input_buffer();
                return;
        
            case 0:
                printf("実数値を入力してください\n");
                clear_input_buffer();
                break;

            case EOF:
                return;
        }
    }
}

void input_int(const char *msg, int *out){
    while(1){
        printf("%s", msg);

        switch(scanf("%d", out)){
            case 1:
                clear_input_buffer();
                return;
        
            case 0:
                printf("整数値を入力してください\n");
                clear_input_buffer();
                break;

            case EOF:
                return;
        }
    }
}

void input_weight(const char *msg, double *weight){
    while(1){
        input_double(msg, weight);
        if(*weight < 20 || *weight >= 300){
            printf("体重は20[kg]以上300[kg]未満で入力してください。\n");
            continue;
        }
        break;
    }
}

void input_date(const char *msg, int *date){
    while(1){
        input_int(msg, date);
        if(*date <= 0 || *date >= 10000){
            printf("日数は1[日]以上10000[日]未満で入力してください\n");
            continue;
        }
        break;
    }
}

void input_ratio(const char *msg, double *ratio){
    while(1){
        input_double(msg, ratio);
        if(*ratio < -100 || *ratio >= 100){
            printf("減量率は-100[%%]以上100[%%]未満で入力してください。\n");
            continue;
        }
        break;
    }
}

void date_Culcuration(double current_weight, int *number_days, double goal_weight, double reduce_ratio){
    *number_days = log(goal_weight / current_weight)/log((100.0 - reduce_ratio) / 100.0);
}

void weight_Culcuration(double current_weight, int number_days, double *goal_weight, double reduce_ratio){
    *goal_weight = current_weight * pow((100.0 - reduce_ratio) / 100.0, number_days);
}

void ratio_Culcuration(double current_weight, int number_days, double goal_weight, double *reduce_ratio){
    *reduce_ratio = 100.0 - 100.0 * pow(goal_weight / current_weight, 1.0 / number_days);
}

void print_daily_goals(double current_weight, int number_days, double goal_weight, double reduce_ratio){
    printf("\n---減量計画---\n");

    double w = current_weight;
    for(int i = 0; i <= number_days; i++){
        if(i == 0)
            printf("%4d日目：%7.2f[kg]（現在の体重）\n", i, w);
        else{
            w *= ((100.0 - reduce_ratio) / 100.0);
            printf("%4d日目：%7.2f[kg]\n", i, w);
        }
    }
}

void do_case1(void){
    double current_weight = 0,  goal_weight = 0, reduce_ratio = 0;
    int number_days = 0;

    printf("目標達成までにかかる日数を計算します。\n");
    input_weight("現在の体重を入力してください[kg]：", &current_weight);
    input_weight("目標体重を入力してください[kg]：", &goal_weight);
    input_ratio("毎日何%ずつ減量していくか入力してください[%]：", &reduce_ratio);
    date_Culcuration(current_weight, &number_days, goal_weight, reduce_ratio);
    printf("\n---計算結果---\n");
    printf("あなたは目標達成までに約\"%d日\"必要です。\n\n", number_days);
    print_daily_goals(current_weight, number_days, goal_weight, reduce_ratio);
}

void do_case2(void){
    double current_weight = 0,  goal_weight = 0, reduce_ratio = 0;
    int number_days = 0;

    printf("減量後の体重を計算します。\n");
    input_weight("現在の体重を入力してください[kg]：", &current_weight);
    input_date("減量期間を入力してください[日]：", &number_days);
    input_ratio("毎日何%ずつ減量していくか入力してください[%]：", &reduce_ratio);
    weight_Culcuration(current_weight, number_days, &goal_weight, reduce_ratio);
    printf("\n---計算結果---\n");
    printf("減量後のあなたの体重は約\"%.2f[kg]\"です。\n\n", goal_weight);
    print_daily_goals(current_weight, number_days, goal_weight, reduce_ratio);
}

void do_case3(void){
    double current_weight = 0,  goal_weight = 0, reduce_ratio = 0;
    int number_days = 0;

    printf("毎日何%%ずつ減量していけばよいか計算します。\n");
    input_weight("現在の体重を入力してください[kg]：", &current_weight);
    input_date("減量期間を入力してください[日]：", &number_days);
    input_weight("目標体重を入力してください[kg]：", &goal_weight);
    ratio_Culcuration(current_weight, number_days, goal_weight, &reduce_ratio);
    printf("\n---計算結果---\n");
    printf("あなたは目標達成のために１日あたり約\"%.2f[%%]\"の減量が必要です。\n\n", reduce_ratio);
    print_daily_goals(current_weight, number_days, goal_weight, reduce_ratio);
}